import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import {
  HighscoreDocument,
  RankItemDocument,
  UserDocument,
  MetadataDocument
} from "@sokontokoro/mikan";
import { getCompare, getHighscoreColRef } from "../utils";

export default functions.firestore
  .document("highscores/{scoreId}")
  .onWrite(async (change, context) => {
    /**
     * first logging
     */
    const { eventId } = context;
    const highscoreId = change.after.id;
    console.log(
      `(${eventId}) catch write event of highscore; ${highscoreId}, `
    );

    /**
     * Check not to be delete event.
     */
    if (!change.after.exists) {
      throw new Error(
        `(${eventId}) unexpected operation trigger! target document is deleted.`
      );
    }

    /**
     * Check target game
     */
    const game = (change.after.data() as HighscoreDocument).game;

    /**
     * Create ranking reference
     */
    const newRankingRef = firestore()
      .collection("ranking")
      .doc();
    const rankingListRef = newRankingRef.collection("list");
    const metadataRef = firestore()
      .collection("metadata")
      .doc(game);

    const metadata = await metadataRef.get();
    const { compareType } = metadata.data() as MetadataDocument;
    const shouldUpdate = getCompare(compareType);

    /**
     * {@link maxSize}毎に、batchを実行する
     * batchの最大実行件数を超えないように計算対象のDocumentを分割して実行する
     *
     * {@link https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja}
     */
    console.log(`(${eventId}) start loop batch process. game:${game}`);
    // ループ処理中、最前点
    let currentPoint =
      compareType === "desc" ? Number.MAX_VALUE : Number.MIN_VALUE;
    // ループ処理中、rank数
    let currentRank = 0;

    //
    let higherScoreCount = 0;

    // 一度にbatch処理するdocumentの数
    const maxSize = 100;

    for (let offset = 0; true; offset += maxSize) {
      // 対象のhighscoreを読み込む
      const scores = await getHighscoreColRef()
        .where("game", "==", game)
        .orderBy("point", compareType)
        .offset(offset)
        .limit(maxSize)
        .get();

      // 全ての計算対象のHighscoreリソースを読み込んだ場合、loopを抜ける
      if (scores.empty) {
        console.log(`(${eventId}) all scores are loaded.`);
        break;
      }

      console.log(`(${eventId}) ${scores.size} scores are loaded.`);

      // batch作成
      const batch = firestore().batch();

      for (const scoreDoc of scores.docs) {
        higherScoreCount++;
        const highscore = scoreDoc.data() as HighscoreDocument;

        // 同率考慮の計算
        // prev itemのpointより低評価の場合、rank数をあげる
        if (shouldUpdate(highscore.point, currentPoint)) {
          currentRank = higherScoreCount;
          currentPoint = highscore.point;
        }

        const userSnapshot = await highscore.userRef.get();
        const userDoc = userSnapshot.data() as UserDocument;

        const rankingDoc: RankItemDocument = {
          uid: userDoc.uid,
          userName: userDoc.displayName,
          member: highscore.member,
          rank: currentRank,
          point: highscore.point
        };

        const rankingItemDocRef = rankingListRef.doc();
        const id = rankingItemDocRef.id;
        const { rank, point } = rankingDoc;
        console.log(
          `(${eventId}) Set score doc to batch. ID: ${id}, rank: ${rank}, point: ${point}`
        );

        batch.set(rankingItemDocRef, rankingDoc);
      }

      // batch実行
      await batch.commit();
    }

    await newRankingRef.set({
      game,
      createdAt: firestore.FieldValue.serverTimestamp()
    });

    await metadataRef.update({
      rankingRef: newRankingRef
    });

    console.log(`(${eventId}) completed`);
  });
