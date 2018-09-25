import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

export default functions.auth.user().onDelete(async user => {
  console.log("user record.", user);

  await firestore()
    .collection("users_deleted")
    .add({
      record: user.toJSON(),
      deletedAt: firestore.FieldValue.serverTimestamp()
    });

  console.log("success to save deleted users collection");

  await firestore()
    .collection("users")
    .doc(user.uid)
    .delete();

  console.log("success to delete target user document.");
});
