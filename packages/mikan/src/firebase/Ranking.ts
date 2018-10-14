import { firestore } from "firebase/app";

import { firebaseDb } from "./index";

export interface RankItemDocument /* extends firestore.DocumentData */ {
  uid: string;
  userName: string;
  member: string;
  rank: number;
  point: number;
}

export interface RankingDocument extends firestore.DocumentData {
  totalCount: number;
  list: firebase.firestore.CollectionReference;
  game: string;
  createdAt: firebase.firestore.FieldValue;
}

export class Ranking {
  public static getColRef() {
    return firebaseDb.collection("ranking");
  }

  public static getDocRef(id: string) {
    return Ranking.getColRef().doc(id);
  }
}
