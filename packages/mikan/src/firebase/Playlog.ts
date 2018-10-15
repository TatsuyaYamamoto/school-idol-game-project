import { firestore } from "firebase/app";
import DocumentReference = firestore.DocumentReference;
import FieldValue = firestore.FieldValue;

import { firebaseDb } from "./index";
import { Game, Member } from "./scheme";
import { User } from "./User";
import { getLogger } from "../logger";

const logger = getLogger("mikan/firebase/db");

export interface PlaylogDocument /* extends firestore.DocumentData */ {
  userRef: DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: object;
  userAgent: string;
  language: string;
  languages: string;
  createdAt: FieldValue | Date;
}

export class Playlog {
  public static getColRef() {
    return firebaseDb.collection("playlogs");
  }

  public static getDocRef(id: string) {
    return Playlog.getColRef().doc(id);
  }

  public static save(
    game: Game,
    member: Member,
    point: number,
    label: object = {}
  ) {
    const userRef = User.getOwnRef();

    logger.debug(`post playlog of user; ${userRef.id}`);

    const doc: PlaylogDocument = {
      userRef,
      game,
      member,
      point,
      label,
      userAgent: navigator.userAgent,
      language: navigator.languages[0],
      languages: navigator.languages.join(";"),
      createdAt: FieldValue.serverTimestamp()
    };

    return Playlog.getColRef().add(doc);
  }
}
