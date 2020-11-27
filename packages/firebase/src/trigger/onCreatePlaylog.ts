import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

import {
  PlaylogDocument,
  HighscoreDocument,
  UserDocument,
} from "@sokontokoro/mikan";

import {
  getHighscoreColRef,
  getCompare,
  loadedMetadata,
  catchErrorWrapper,
} from "../utils";

export default functions.firestore.document("playlogs/{playlogId}").onCreate(
  catchErrorWrapper(async (snapshot, context) => {
    console.log({
      message: `start playlogs/${snapshot.id}#onCreate event.`,
      detail: [snapshot, context],
    });

    /**
     * Check targer log
     */
    const playlogDoc = snapshot.data() as PlaylogDocument;
    const game = playlogDoc.game;
    const userRef = playlogDoc.userRef;
    const userDoc = (await userRef.get()).data() as UserDocument;

    const highscoreSnapshot = await getHighscoreColRef()
      .where("game", "==", game)
      .where("userRef", "==", userRef)
      .get();
    const { compareType } = await loadedMetadata(playlogDoc.game);
    const shouldUpdate = getCompare(compareType);

    // try saving with batch
    const batch = firestore().batch();

    // Create highscore batch
    const highscoreRef = highscoreSnapshot.empty
      ? getHighscoreColRef().doc()
      : highscoreSnapshot.docs[0].ref;

    if (highscoreSnapshot.empty) {
      console.log(`prev score snapshot is empty. create new document.`);

      const doc: HighscoreDocument = {
        userRef: playlogDoc.userRef,
        game: playlogDoc.game,
        member: playlogDoc.member,
        point: playlogDoc.point,
        label: playlogDoc.label,
        count: 1,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        brokenAt: firestore.FieldValue.serverTimestamp(),
      };

      batch.set(highscoreRef, doc);

      // Create user batch
      const updateUserDoc: Partial<UserDocument> = {
        highscoreRefs: {
          ...userDoc.highscoreRefs,
          [game]: highscoreRef as any,
        },
      };

      batch.update(userRef as any, updateUserDoc);
    } else {
      console.log(
        `prev score snapshot is found. check if the score is updated.`
      );

      const prevScoreDoc = highscoreSnapshot.docs[0].data() as HighscoreDocument;

      const doc: Partial<HighscoreDocument> = {
        count: prevScoreDoc.count + 1,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (shouldUpdate(prevScoreDoc.point, playlogDoc.point)) {
        doc.point = playlogDoc.point;
        doc.label = playlogDoc.label;
        doc.brokenAt = firestore.FieldValue.serverTimestamp();
      }

      batch.update(highscoreRef, doc);
    }

    // execute!
    await batch.commit();

    console.log({
      message: `end playlogs/${snapshot.id}#onCreate success.`,
    });
  })
);
