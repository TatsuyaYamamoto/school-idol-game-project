import { firestore } from "firebase";

export interface MetadataDocument extends firestore.DocumentData {
  compareType: "desc" | "asc";
  rankingRef: firestore.CollectionReference;
}
