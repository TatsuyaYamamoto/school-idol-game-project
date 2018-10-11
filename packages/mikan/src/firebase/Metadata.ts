import { firestore as adminFirestore } from "firebase-admin";
import { firestore } from "firebase/app";

export interface MetadataDocument /* extends firestore.DocumentData */ {
  compareType: "desc" | "asc";
  rankingRef: firestore.DocumentReference | adminFirestore.DocumentReference;
}
