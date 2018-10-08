import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

import { UserDocument } from "@sokontokoro/mikan";

export default functions.auth.user().onCreate(async user => {
  try {
    console.log({
      message: `start firebase auth user;${user.uid}, onCreate event.`,
      detail: user
    });

    const newUser: UserDocument = {
      uid: user.uid,
      isAnonymous: true,
      displayName: getRandomAnonymousName(),
      highscoreRefs: {},
      providers: {},
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      duplicatedRefsByLink: []
    };

    await firestore()
      .collection("users")
      .doc(user.uid)
      .set(newUser);
  } catch (e) {
    console.log({
      message: "FATAL ERROR! catch unhandled error.",
      detail: e
    });
  }
});

// TODO
function getRandomAnonymousName() {
  return "いかした学園生";
}
