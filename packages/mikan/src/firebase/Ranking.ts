import firebase from "firebase/app";

import { firebaseDb } from "./index";
import { Member } from "..";

type CollectionReference = firebase.firestore.CollectionReference;
type FieldValue = firebase.firestore.FieldValue;

export interface RankItemDocument /* extends firestore.DocumentData */ {
  uid: string;
  userName: string;
  member: Member;
  rank: number;
  point: number;
}

export interface RankingDocument /* extends firestore.DocumentData */ {
  totalCount: number;
  list: CollectionReference;
  game: string;
  createdAt: FieldValue;
}

export class Ranking {
  public static getColRef(): firebase.firestore.CollectionReference {
    return firebaseDb.collection("ranking");
  }

  public static getDocRef(id: string): firebase.firestore.DocumentReference {
    return Ranking.getColRef().doc(id);
  }
}
