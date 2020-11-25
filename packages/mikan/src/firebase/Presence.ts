import firebase from "firebase/app";
type FieldValue = firebase.firestore.FieldValue;
type Timestamp = firebase.firestore.Timestamp;
type DocumentReference = firebase.firestore.DocumentReference;
type CollectionReference = firebase.firestore.CollectionReference;

import { firebaseDb } from "./index";
import { User } from "./User";
import MikanError, { ErrorCode } from "../MikanError";

/**
 * Schema for Realtime Database
 *
 * FirestoreにPresence情報を反映する前にRealtimeDatabase内のJsonを削除すると、UIDを読み取れない。
 * online = falseの変更を読み取り、Firestoreへ反映後、{@code PresenceDbJson}を削除する。
 */
export interface PresenceDbJson {
  uid: string;
  online: true;
  userAgent: string;
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
    if (!Presence._id) {
      throw new MikanError(
        ErrorCode.FIREBASE_NO_PRESENCE,
        "should initialize connection to firebase before getting presence id."
      );
    }

    return Presence._id;
  }

  public static getColRef(): CollectionReference {
    return firebaseDb.collection("presences");
  }

  public static getDocRef(id: string): DocumentReference {
    return Presence.getColRef().doc(id);
  }

  /**
   * @return generated ID of presence
   *
   * TODO consider multi device connection by the same user.
   * NOTE: 全てRealtimeDatabaseのAPI
   */
  public static initWatch(): string {
    const uid = User.getOwnRef().id;
    const infoConnectedRef = firebase.database().ref(".info/connected");
    const presencesRef = firebase.database().ref(`presences`);
    const newPresenceRef = presencesRef.push();
    const newPresenceId = newPresenceRef.key;

    const onlineState: PresenceDbJson = {
      uid,
      online: true,
      userAgent: navigator.userAgent,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };

    // since I can connect from multiple devices or browser tabs, we store each connection instance separately
    // any time that connectionsRef's value is null (i.e. has no children) I am offline
    // var myConnectionsRef = firebase.database().ref("users/joe/connections");

    // stores the timestamp of my last disconnect (the last time I was seen online)

    infoConnectedRef.on("value", async function(snapshot) {
      if (snapshot && snapshot.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        // var con = ownPresenceRef.push();

        // When I disconnect, remove this device
        newPresenceRef.onDisconnect().update({
          online: false
        });

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        newPresenceRef.set(onlineState);
      }
    });

    if (!newPresenceId) {
      throw new Error("fail to issue new presence ID.");
    }

    return (Presence._id = newPresenceId);
  }
}
