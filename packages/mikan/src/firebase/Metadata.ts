import firebase from "firebase";
type DocumentReference = firebase.firestore.DocumentReference;

export interface MetadataDocument /* extends firestore.DocumentData */ {
  compareType: "desc" | "asc";
  rankingRef: DocumentReference;
  updatedAt: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
}
