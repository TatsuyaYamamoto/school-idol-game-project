import { firestore } from "firebase";

import { firebaseDb } from "./index";
import { Member } from "../model/members";
import { Game } from "../model/games";

export interface HighscoreDocument /* extends firestore.DocumentData */ {
  userRef: firestore.DocumentReference;
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
