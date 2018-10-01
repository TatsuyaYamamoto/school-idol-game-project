import { firestore } from "firebase";
import { Game, Member } from "./scheme";

export interface PlaylogDocument extends firestore.DocumentData {
  userRef: firestore.DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: object;
  userAgent: string;
  language: string;
  languages: string;
  createdAt: firestore.FieldValue;
}

export class Playlog {
  public static getColRef() {
    return firestore().collection("playlogs");
  }

  public static getDocRef(id: string) {
    return Playlog.getColRef().doc(id);
  }

  public static save(doc: PlaylogDocument) {
    return Playlog.getColRef().add(doc);
  }
}
