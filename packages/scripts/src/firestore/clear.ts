import { firestore } from "firebase-admin";
import DocumentReference = firestore.DocumentReference;

import { splitList } from "./import";
import { db, auth } from "./index";

export default async function clearFirestore() {
  // Step1. delete subcollection of ranking

  const rankingSnapshot = await db.collection("ranking").get();

  console.log(
    `"ranking" has ${rankingSnapshot.size} docs. try to delete recursively.`
  );

  for (const rankingDoc of rankingSnapshot.docs) {
    const rankingListSnapshot = await rankingDoc.ref.collection("list").get();
    console.log(
      `"ranking/${rankingDoc.id}" has ${rankingListSnapshot.size} docs.`
    );

    for (const rankingListItemDoc of rankingListSnapshot.docs) {
      await rankingListItemDoc.ref.delete();
    }
  }

  console.log(`"ranking/**/list"'s all docs are deleted.`);

  // Step2. delete root collections
  const cols = ["users", "users_deleted", "highscores", "playlogs", "ranking"];

  for (const col of cols) {
    const snapshot = await db.collection(col).get();
    const targetRefs: DocumentReference[] = [];
    for (const doc of snapshot.docs) {
      targetRefs.push(doc.ref);
    }

    console.log(`"${col}" has ${targetRefs.length} docs. try to delete.`);

    for (const batchTargetRefs of splitList(targetRefs, 100)) {
      const batch = db.batch();
      batchTargetRefs.forEach(ref => batch.delete(ref));
      batch.commit();
    }

    console.log(`=> all docs are deleted.`);
  }

  // Step3. Delete all auth users
  // see auth limit https://firebase.google.com/docs/auth/limits
  const { users } = await auth.listUsers();
  console.log(
    `"auth" has ${
      users.length
    } users. try split deletion under firebase auth limit.`
  );

  for (const batchTarget of splitList(users, 10)) {
    Promise.all(
      batchTarget.map(user => {
        return auth.deleteUser(user.uid);
      })
    );

    console.log(`${batchTarget.length} users are deleted.`);

    await wait(1000);
  }
  console.log(`=> all auth users are deleted.`);

  process.exit();
}

function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
