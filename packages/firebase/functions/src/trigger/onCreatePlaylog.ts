import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

import { PlaylogDocument, HighscoreDocument } from "@sokontokoro/mikan";

import {
  getHighscoreColRef,
  getHighscoreSnapshot,
  getCompare,
  loadedMetadata
} from "../utils";

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
      const highscoreSnapshot = await getHighscoreSnapshot(
        playlogDoc.game,
        playlogDoc.userRef
      );

      if (highscoreSnapshot === null) {
        console.log(`prev score snapshot is empty. create new document.`);
        await addHighscore(playlogDoc);
      } else {
        console.log(
          `prev score snapshot is found. check if the score is updated.`
        );
        await updateHighscore(playlogDoc, highscoreSnapshot);
      }

      console.log({
        message: `start playlogs/${snapshot.id}#onCreate success.`
      });
    } catch (e) {
      console.log({
        message: "FATAL ERROR! catch unhandled error.",
        detail: e
      });
    }
  });

async function addHighscore({
  userRef,
  game,
  member,
  point,
  label
}: PlaylogDocument) {
  const highscore = {
    userRef,
    game,
    member,
    point,
    label,
    count: 1,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    brokenAt: firestore.FieldValue.serverTimestamp()
  };

  await getHighscoreColRef().add(highscore);
}

async function updateHighscore(
  { game, point }: PlaylogDocument,
  highscoreSnapshot: firestore.DocumentSnapshot
) {
  const { compareType } = await loadedMetadata(game);
  const shouldUpdate = getCompare(compareType);

  const prevScoreRef = highscoreSnapshot.ref;
  const prevScore = highscoreSnapshot.data() as HighscoreDocument;

  const score: HighscoreDocument = {
    ...prevScore,
    count: prevScore.count + 1,
    updatedAt: firestore.FieldValue.serverTimestamp()
  };

  if (shouldUpdate(prevScore.point, point)) {
    score.point = point;
    score.brokenAt = firestore.FieldValue.serverTimestamp();
  }

  await prevScoreRef.update(score);
}
