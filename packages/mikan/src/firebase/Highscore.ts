import { firebaseDb } from "./index";
import { Game, Member } from "./scheme";

export interface HighscoreDocument /* extends firestore.DocumentData */ {
  userRef: firebase.firestore.DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: object;
  count: number;
  createdAt: firebase.firestore.FieldValue | Date;
  updatedAt: firebase.firestore.FieldValue | Date;
  brokenAt: firebase.firestore.FieldValue | Date;
}

export class Highscore {
  public static getColRef() {
    return firebaseDb.collection("highscores");
  }

  public static getDocRef(id: string) {
    return Highscore.getColRef().doc(id);
  }
}
