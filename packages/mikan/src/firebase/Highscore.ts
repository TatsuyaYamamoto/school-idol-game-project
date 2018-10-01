import { firestore } from "firebase";
import { Game, Member } from "./scheme";
import { PlaylogDocument } from "./Playlog";

export interface HighscoreDocument extends firestore.DocumentData {
  userRef: firestore.DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: string | null;
  count: number;
  createdAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
  brokenAt: firestore.FieldValue;
}

export class Highscore {
  public static getColRef() {
    return firestore().collection("highscores");
  }

  public static getDocRef(id: string) {
    return Highscore.getColRef().doc(id);
  }
}
