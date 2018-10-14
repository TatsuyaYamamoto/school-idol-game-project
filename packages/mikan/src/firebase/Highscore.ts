import { firestore as adminFirestore } from "firebase-admin";
import { firestore } from "firebase/app";

import { firebaseDb } from "./index";
import { Game, Member } from "./scheme";

export interface HighscoreDocument /* extends firestore.DocumentData */ {
  userRef: firestore.DocumentReference | adminFirestore.DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: object;
  count: number;
  createdAt: firestore.FieldValue | Date;
  updatedAt: firestore.FieldValue | Date;
  brokenAt: firestore.FieldValue | Date;
}

export class Highscore {
  public static getColRef() {
    return firebaseDb.collection("highscores");
  }

  public static getDocRef(id: string) {
    return Highscore.getColRef().doc(id);
  }
}
