import { firestore } from "firebase";
import { Game, Member } from "./scheme";

export interface RankItemDocument extends firestore.DocumentData {
  uid: string;
  userName: string;
  member: string;
  rank: number;
  point: number;
}

export interface RankingDocument extends firestore.DocumentData {
  list: firestore.CollectionReference;
  game: string;
  createdAt: firestore.FieldValue;
}

export class Ranking {
  public static getColRef() {
    return firestore().collection("ranking");
  }

  public static getDocRef(id: string) {
    return Ranking.getColRef().doc(id);
  }
}
