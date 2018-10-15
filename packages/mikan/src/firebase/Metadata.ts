import { firestore } from "firebase";
import DocumentReference = firestore.DocumentReference;

export interface MetadataDocument /* extends firestore.DocumentData */ {
  compareType: "desc" | "asc";
  rankingRef: DocumentReference;
}
