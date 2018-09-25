import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

export default functions.auth.user().onCreate(async user => {
  console.log(user);

  await firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      uid: user.uid,
      isAnonymous: true,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
  return;
});
