import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

import { UserDocument } from "@sokontokoro/mikan";

export default functions.auth.user().onCreate(async user => {
  console.log(user);

  const newUser: UserDocument = {
    uid: user.uid,
    isAnonymous: true,
    displayName: getRandomAnonymousName(),
    highscoreRefs: {},
    providers: {},
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp()
  };

  await firestore()
    .collection("users")
    .doc(user.uid)
    .set(newUser);
  return;
});

function getRandomAnonymousName() {
  return "いかした学園生";
}
