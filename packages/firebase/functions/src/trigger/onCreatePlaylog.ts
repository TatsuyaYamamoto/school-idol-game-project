import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

import {
  PlaylogDocument,
  HighscoreDocument,
  MetadataDocument
} from "@sokontokoro/mikan";
import { getHighscoreColRef, getHighscoreSnapshot, getCompare } from "../utils";

export default functions.firestore
  .document("playlogs/{playlogId}")
  .onCreate(async (snapshot, context) => {
    /**
     * first logging
     */
    const { eventId } = context;
    const playlogId = snapshot.id;
    console.log(`(${eventId}) catch create event of playlog; ${playlogId}, `);

    /**
     * Check targer log
     */
    const playlog = snapshot.data() as PlaylogDocument;
    const { userRef, game, point, member, label } = playlog;

    const metadata = await firestore()
      .collection("metadata")
      .doc(game)
      .get();
    const { compareType } = metadata.data() as MetadataDocument;

    const shouldUpdate = getCompare(compareType);

    const highscoreSnapshot = await getHighscoreSnapshot(
      playlog.game,
      playlog.userRef
    );

    if (!highscoreSnapshot) {
      console.log(
        `(${eventId}) prev score snapshot is empty. create new document.`
      );

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
    } else {
      console.log(
        `(${eventId}) prev score snapshot is found. check if the score is updated.`
      );

      const prevScoreRef = highscoreSnapshot.ref;
      const prevScore = highscoreSnapshot.data() as HighscoreDocument;

      const score: HighscoreDocument = {
        ...prevScore,
        count: prevScore.count + 1,
        updatedAt: firestore.FieldValue.serverTimestamp()
      };

      if (shouldUpdate(prevScore.point, point)) {
        console.log(
          `(${eventId}) break record! prev:${prevScore.point}, next: ${point}`
        );

        score.point = point;
        score.brokenAt = firestore.FieldValue.serverTimestamp();
      }

      await prevScoreRef.update(score);
    }

    console.log(`(${eventId}) completed`);
  });
