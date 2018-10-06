import { firestore } from "firebase/app";

import { firebaseDb } from "./index";
import { Game, Member } from "./scheme";
import { getLogger } from "../logger";
import { Playlog } from "./Playlog";
import { User } from "./User";

const logger = getLogger("mikan/firebase/db");

export async function postScore(
  game: Game,
  member: Member,
  point: number,
  label: object = {}
) {
  const userRef = User.getOwnRef();

  logger.debug(`post playlog of user; ${userRef.id}`);

  return Playlog.save({
    userRef,
    game,
    member,
    point,
    label,
    userAgent: navigator.userAgent,
    language: navigator.languages[0],
    languages: navigator.languages.join(";"),
    createdAt: firestore.FieldValue.serverTimestamp()
  });
}

export async function mergeUsers() {
  // const duplicateUserRef = firestore()
  //   .collection("users")
  //   .doc(duplicatedUser.uid);
  //
  // const userRef = firestore()
  //   .collection("users")
  //   .doc(user.uid);
  //
  // duplicateUserRef.get().then(snapshot => {
  //   const doc = snapshot.data();
  // });
  //
  // firestore()
  //   .collection("games")
  //   .get()
  //   .then(snapshot => {
  //     for (const doc of snapshot.docs) {
  //       firestore()
  //         .collection("games")
  //         .doc(doc.id)
  //         .collection("scores")
  //         .where("user", "==", duplicatedUser.uid)
  //         .get();
  //     }
  //   });
  //
  // await Promise.all([duplicateUserRef.delete(), duplicatedUser.delete()]);
}
