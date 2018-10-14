export interface MetadataDocument /* extends firestore.DocumentData */ {
  compareType: "desc" | "asc";
  rankingRef: firebase.firestore.DocumentReference;
}
