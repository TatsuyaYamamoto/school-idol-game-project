import firebase from "firebase/app";

import { FirebaseClient } from "./FirebaseClient";
import { User } from "./User";
import MikanError, { ErrorCode } from "../MikanError";

type FieldValue = firebase.firestore.FieldValue;
type Timestamp = firebase.firestore.Timestamp;
type DocumentReference = firebase.firestore.DocumentReference;
type CollectionReference = firebase.firestore.CollectionReference;

/**
 * Schema for Realtime Database
 *
 * FirestoreにPresence情報を反映する前にRealtimeDatabase内のJsonを削除すると、UIDを読み取れない。
 * online = falseの変更を読み取り、Firestoreへ反映後、{@code PresenceDbJson}を削除する。
 */
export interface PresenceDbJson {
  uid: string;
  online: boolean;
  userAgent: string;
  // eslint-disable-next-line
  createdAt: /* read */ number | /* write */ Object;
}

export interface PresenceDocument /* extends firestore.DocumentData */ {
  userRef: DocumentReference;
  userAgent: string;
  createdAt: /* read */ Timestamp | /* write */ FieldValue;
}

export class Presence {
  private static _id: string | null = null;

  public static get id(): string {
    // eslint-disable-next-line
    if (!Presence._id) {
      throw new MikanError(
        ErrorCode.FIREBASE_NO_PRESENCE,
        "should initialize connection to firebase before getting presence id."
      );
    }

    // eslint-disable-next-line
    return Presence._id;
  }

  public static getColRef(): CollectionReference {
    return FirebaseClient.firestore.collection("presences");
  }

  public static getDocRef(id: string): DocumentReference {
    return Presence.getColRef().doc(id);
  }

  /**
   *
   * TODO consider multi device connection by the same user.
   * NOTE: 全てRealtimeDatabaseのAPI
   */
  public static async initWatch(): Promise<void> {
    const uid = User.getOwnRef().id;
    const infoConnectedRef = firebase.database().ref(".info/connected");
    const presencesRef = firebase.database().ref(`presences`);

    const onlineState: PresenceDbJson = {
      uid,
      online: true,
      userAgent: navigator.userAgent,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    const offlinePartialState: Partial<PresenceDbJson> = {
      online: false,
    };

    return new Promise((resolve) => {
      infoConnectedRef.on("value", async (snapshot) => {
        const connected = snapshot.val();

        if (connected) {
          const newPresenceRef = presencesRef.push();
          // eslint-disable-next-line
          Presence._id = newPresenceRef.key;

          await newPresenceRef.set(onlineState);
          await newPresenceRef.onDisconnect().update(offlinePartialState);
          infoConnectedRef.off("value");
          resolve();
        }
      });
    });
  }
}
