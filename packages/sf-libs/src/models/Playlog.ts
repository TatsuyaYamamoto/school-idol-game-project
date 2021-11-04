import firebase from "firebase/app";

import { FirebaseClient } from "./FirebaseClient";
import { User } from "./User";
import { Member, Game } from "..";
import { getLogger } from "../logger";

type DocumentReference = firebase.firestore.DocumentReference;
type FieldValue = firebase.firestore.FieldValue;

const logger = getLogger("mikan/firebase/playlog");

export interface PlaylogDocument /* extends firestore.DocumentData */ {
  userRef: DocumentReference;
  game: Game;
  member: Member;
  point: number;
  label: Record<string, unknown>;
  userAgent: string;
  language: string;
  languages: string;
  createdAt: FieldValue | Date;
}

export class Playlog {
  public static getColRef(): firebase.firestore.CollectionReference {
    return FirebaseClient.firestore.collection("playlogs");
  }

  public static getDocRef(id: string): firebase.firestore.DocumentReference {
    return Playlog.getColRef().doc(id);
  }

  public static save(
    game: Game,
    member: Member,
    point: number,
    label: Record<string, unknown> = {}
  ): Promise<firebase.firestore.DocumentReference> {
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
