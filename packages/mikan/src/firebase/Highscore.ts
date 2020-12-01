import firebase from "firebase/app";

import { FirebaseClient } from "./FirebaseClient";
import { Member, Game } from "..";

export interface HighscoreDocument /* extends firestore.DocumentData */ {
  userRef: firebase.firestore.DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: Record<string, unknown> /* any object */;
  count: number;

  createdAt: firebase.firestore.FieldValue | Date;
  updatedAt: firebase.firestore.FieldValue | Date;
  brokenAt: firebase.firestore.FieldValue | Date;
}

export class Highscore {
  public static getColRef(): firebase.firestore.CollectionReference {
    return FirebaseClient.firestore.collection("highscores");
  }

  public static getDocRef(id: string): firebase.firestore.DocumentReference {
    return Highscore.getColRef().doc(id);
  }
}
