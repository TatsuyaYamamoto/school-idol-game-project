import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import { RoomDocument } from "@sokontokoro/mikan";
import { catchErrorWrapper } from "../utils";

export default functions.firestore.document("rooms/{roomId}").onUpdate(
  catchErrorWrapper(async (change, _context) => {
    if (!change.before.exists) {
      // onCreated
      return;
    }
    if (!change.after.exists) {
      // onDeleted
      return;
    }

    const afterDoc = change.after.data() as RoomDocument;

    if (Object.keys(afterDoc.userIds).length === 0) {
      await onLeftAllMember(change.after.ref);
      return;
    }
  })
);

async function onLeftAllMember(roomRef: firestore.DocumentReference) {
  await roomRef.delete();
}
