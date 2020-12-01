import firebase from "firebase/app";

import { FirebaseClient } from "./FirebaseClient";

type FieldValue = firebase.firestore.FieldValue;
type QuerySnapshot = firebase.firestore.QuerySnapshot;
type DocumentReference = firebase.firestore.DocumentReference;
type CollectionReference = firebase.firestore.CollectionReference;

/**
 * @link https://github.com/firebase/firebase-js-sdk/blob/master/packages/auth/src/idp.js#L34
 */
export type ProviderId = "twitter.com";

export interface CredentialDocument /* extends firestore.DocumentData */ {
  userRef: DocumentReference;
  providerId: ProviderId;
  data:
    | {
        // for twitter
        accessToken: string;
        secret: string;
      }
    | Record<string, never> /* empty object */;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export class Credential {
  public static getColRef(): CollectionReference {
    return FirebaseClient.firestore.collection("credentials");
  }

  public static getDocRef(id: string): DocumentReference {
    return Credential.getColRef().doc(id);
  }

  public static get(userRef: DocumentReference): Promise<QuerySnapshot> {
    return Credential.getColRef().where("userRef", "==", userRef).get();
  }
}
