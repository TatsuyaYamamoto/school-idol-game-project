import { firestore } from "firebase/app";
import "firebase/firestore";

export function userColRef(): firestore.CollectionReference {
  return firestore().collection("users");
}

export function userDocRef(uid: string): firestore.DocumentReference {
  return firestore().doc(`users/${uid}`);
}
