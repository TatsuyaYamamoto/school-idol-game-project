import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

import { PlaylogDocument, HighscoreDocument } from "@sokontokoro/mikan";

import { getHighscoreColRef, getCompare, loadedMetadata } from "../utils";

export default functions.firestore
  .document("playlogs/{playlogId}")
  .onCreate(async (snapshot, context) => {
    try {
      console.log({
        message: `start playlogs/${snapshot.id}#onCreate event.`,
        detail: [snapshot, context]
      });

      /**
       * Check targer log
       */
      const playlogDoc = snapshot.data() as PlaylogDocument;
      const query = getHighscoreColRef()
        .where("game", "==", playlogDoc.game)
        .where("userRef", "==", playlogDoc.userRef);
      const { compareType } = await loadedMetadata(playlogDoc.game);
      const shouldUpdate = getCompare(compareType);

      await firestore().runTransaction(async transaction => {
        const snapshot = await transaction.get(query);

        if (snapshot.empty) {
          console.log(`prev score snapshot is empty. create new document.`);

          await transaction.create(getHighscoreColRef().doc(), {
            userRef: playlogDoc.userRef,
            game: playlogDoc.game,
            member: playlogDoc.member,
            point: playlogDoc.point,
            label: playlogDoc.label,
            count: 1,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
            brokenAt: firestore.FieldValue.serverTimestamp()
          } as HighscoreDocument);
        } /* exist */ else {
          console.log(
            `prev score snapshot is found. check if the score is updated.`
          );
          const prevScoreRef = snapshot.docs[0].ref;
          const prevScoreDoc = snapshot.docs[0].data() as HighscoreDocument;

          const newHighscore: HighscoreDocument = {
            ...prevScoreDoc,
            count: prevScoreDoc.count + 1,
            updatedAt: firestore.FieldValue.serverTimestamp()
          };

          if (shouldUpdate(prevScoreDoc.point, playlogDoc.point)) {
            newHighscore.point = playlogDoc.point;
            newHighscore.brokenAt = firestore.FieldValue.serverTimestamp();
          }

          await transaction.update(prevScoreRef, newHighscore);
        }
      });

      console.log({
        message: `end playlogs/${snapshot.id}#onCreate success.`
      });
    } catch (e) {
      console.log({
        message: "FATAL ERROR! catch unhandled error.",
        detail: e
      });
    }
  });
