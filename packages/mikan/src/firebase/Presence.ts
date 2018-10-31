import { firestore } from "firebase/app";

import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;
import DocumentReference = firestore.DocumentReference;
import CollectionReference = firestore.CollectionReference;

import { firebaseDb } from "./index";

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
  public static getColRef(): CollectionReference {
    return firebaseDb.collection("presences");
  }

  public static getDocRef(id: string): DocumentReference {
    return Presence.getColRef().doc(id);
  }
}
