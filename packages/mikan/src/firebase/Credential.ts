import { firestore } from "firebase/app";

import FieldValue = firestore.FieldValue;
import QuerySnapshot = firestore.QuerySnapshot;
import DocumentReference = firestore.DocumentReference;
import CollectionReference = firestore.CollectionReference;

import { firebaseDb } from "./index";

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
    | {};
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export class Credential {
  public static getColRef(): CollectionReference {
    return firebaseDb.collection("credentials");
  }

  public static getDocRef(id: string): DocumentReference {
    return Credential.getColRef().doc(id);
  }

  public static get(userRef: DocumentReference): Promise<QuerySnapshot> {
    return Credential.getColRef()
      .where("userRef", "==", userRef)
      .get();
  }
}
