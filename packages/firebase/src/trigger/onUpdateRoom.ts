import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
// eslint-disable-next-line import/no-extraneous-dependencies
import { RoomDocument } from "@sokontokoro/mikan";

import { catchErrorWrapper } from "../utils";

async function onLeftAllMember(roomRef: firestore.DocumentReference) {
  await roomRef.delete();
}

export default functions.firestore.document("rooms/{roomId}").onUpdate(
  catchErrorWrapper(async (change) => {
    if (!change.before.exists) {
      // onCreated
      return;
    }
    if (!change.after.exists) {
      // onDeleted
      return;
    }

    const afterDoc = change.after.data() as RoomDocument;

    if (Object.keys(afterDoc.userPresenceRefs).length === 0) {
      await onLeftAllMember(change.after.ref);
    }
  })
);
