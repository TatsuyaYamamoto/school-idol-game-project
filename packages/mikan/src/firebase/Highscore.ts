import { firestore } from "firebase/app";

import { firebaseDb } from "./index";
import { Game, Member } from "./scheme";

export interface HighscoreDocument /* extends firestore.DocumentData */ {
  userRef: firestore.DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: object;
  count: number;
  createdAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
  brokenAt: firestore.FieldValue;
}

export class Highscore {
  public static getColRef() {
    return firebaseDb.collection("highscores");
  }

  public static getDocRef(id: string) {
    return Highscore.getColRef().doc(id);
  }
}
