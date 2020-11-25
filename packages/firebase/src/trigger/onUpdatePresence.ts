import * as functions from "firebase-functions";
import { firestore, database } from "firebase-admin";
import { PresenceDbJson, PresenceDocument } from "@sokontokoro/mikan";

/**
 * note: variable suffix
 * _rd => realtime database
 * _cf => cloud firestore
 */
export default functions.database
  .ref("/presences/{id}")
  .onWrite(async (change, context) => {
    const presenceId = context.params.id;

    if (!change.after.exists() /* onDeleted */) {
      // presence in realtime database is deleted. should ignore.
      return;
    }

    if (!change.before.exists() /* onCreated */) {
      // creation new presence json is same meaning that client turns online.
      await onChangeOnline(presenceId, change.after);
      return;
    }

    const beforePresence_rd = change.before.val() as PresenceDbJson;
    const afterPresence_rd = change.after.val() as PresenceDbJson;

    if (beforePresence_rd.online && !afterPresence_rd.online) {
      // client turns offline
      await onChangeOffline(presenceId, change.after);
      return;
    }
  });

async function onChangeOnline(
  presenceId: string,
  createdSnapshot: database.DataSnapshot
) {
  const createdPresence_rd = createdSnapshot.val() as PresenceDbJson;
  const uid = createdPresence_rd.uid;

  const createPresenceRef_cf = firestore()
    .collection("presences")
    .doc(presenceId);

  const userRef_cf = firestore()
    .collection("users")
    .doc(uid);

  const newPresenceDoc_cf: PresenceDocument = {
    userRef: userRef_cf as any,
    userAgent: createdPresence_rd.userAgent,
    createdAt: firestore.Timestamp.fromMillis(
      createdPresence_rd.createdAt as number
    )
  };

  const batch = firestore().batch();
  batch.set(createPresenceRef_cf, newPresenceDoc_cf);
  batch.update(userRef_cf, {
    [`presenceRefs.${presenceId}`]: createPresenceRef_cf
  });

  await batch.commit();
}

async function onChangeOffline(
  presenceId: string,
  offlineSnapshot: database.DataSnapshot
) {
  const offlinePresence_rd = offlineSnapshot.val() as PresenceDbJson;
  const uid = offlinePresence_rd.uid;

  const deletePresenceRef_cf = firestore()
    .collection("presences")
    .doc(presenceId);

  const userRef_cf = firestore()
    .collection("users")
    .doc(uid);

  const roomDocsRef_cf = firestore()
    .collection("rooms")
    .where(`userPresenceRefs.${uid}`, "==", deletePresenceRef_cf);

  const batch = firestore().batch();
  batch.delete(deletePresenceRef_cf);
  batch.update(userRef_cf, {
    [`presenceRefs.${presenceId}`]: firestore.FieldValue.delete()
  });
  (await roomDocsRef_cf.get()).forEach(result => {
    batch.update(result.ref, {
      [`userPresenceRefs.${uid}`]: firestore.FieldValue.delete()
    });
  });

  // TODO type safe
  await Promise.all<any>([batch.commit(), offlineSnapshot.ref.remove()]);
}
