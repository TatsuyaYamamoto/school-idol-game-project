import firebase from "firebase/app";
type DocumentReference = firebase.firestore.DocumentReference;
type FieldValue = firebase.firestore.FieldValue;

import { firebaseDb } from "./index";
import { User } from "./User";
import { Member } from "../model/members";
import { Game } from "../model/games";
import { getLogger } from "../logger";

const logger = getLogger("mikan/firebase/playlog");

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
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return Playlog.getColRef().add(doc);
  }
}
