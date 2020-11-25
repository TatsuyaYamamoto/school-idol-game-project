import firebase from "firebase/app";
type CollectionReference = firebase.firestore.CollectionReference;
type FieldValue = firebase.firestore.FieldValue;

import { firebaseDb } from "./index";
import { Member } from "../model/members";

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
  public static getColRef() {
    return firebaseDb.collection("ranking");
  }

  public static getDocRef(id: string) {
    return Ranking.getColRef().doc(id);
  }
}
