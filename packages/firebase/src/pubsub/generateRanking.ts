import { firestore } from "firebase-admin";
import { pubsub } from "firebase-functions";

import {
  MetadataDocument,
  HighscoreDocument,
  RankingDocument,
  RankItemDocument,
  UserDocument,
  Game,
  // eslint-disable-next-line import/no-extraneous-dependencies
} from "@sokontokoro/mikan";
import {
  addDocWithBatch,
  getCompare,
  getHighscoreColRef,
  getMetadataRef,
  loadedMetadata,
} from "../utils";

const TARGET_GAMES: Game[] = [
  "honocar",
  "shakarin",
  "maruten",
  "yamidori",
  "oimo-no-mikiri",
];

export default pubsub
  .schedule("00 09 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    console.log(`run scheduled "generate-ranking" job. ID: ${context.eventId}`);

    try {
      // eslint-disable-next-line
      for (const game of TARGET_GAMES) {
        console.log(`start creation. game: ${game}`);

        const metadataRef = getMetadataRef(game);
        const newRankingRef = firestore().collection("ranking").doc();
        const newRankingListRef = newRankingRef.collection("list");

        /**
         * step 1
         * Load all highscore resources and calculate ranking list.
         */
        // eslint-disable-next-line
        const rankingList = await createRankingList(game);

        console.log(
          `create ranking item docs. game: ${game}, size: ${rankingList.length}`
        );

        /**
         * step 2
         * save new ranking list with batch
         */
        // eslint-disable-next-line
        await addDocWithBatch(newRankingListRef, rankingList);

        console.log(
          `success to create new ranking resource; ${newRankingRef.path}`
        );

        /**
         * step 3
         * update metadata about this ranking
         */
        const metadataBatch = firestore().batch();
        const newRanking: Partial<RankingDocument> = {
          game,
          totalCount: rankingList.length,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };
        metadataBatch.set(newRankingRef, newRanking);

        const newMetadata: Partial<MetadataDocument> = {
          // eslint-disable-next-line
          rankingRef: newRankingRef as any,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        };
        metadataBatch.update(metadataRef, newMetadata);

        // eslint-disable-next-line
        await metadataBatch.commit();

        console.log(`success! game: ${game}`);
      }

      console.log(
        `It's completed to create ranking; ${TARGET_GAMES.join(", ")}.`
      );
    } catch (e) {
      console.error({
        message: "FATAL ERROR! catch unhandled error.",
        detail: e,
      });
    }
  });

async function createRankingList(game: string): Promise<RankItemDocument[]> {
  const { compareType } = await loadedMetadata(game);
  const shouldUpdate = getCompare(compareType);

  // ループ処理中、最良点
  let currentPoint =
    compareType === "desc" ? Number.MAX_VALUE : Number.MIN_VALUE;
  // ループ処理中、rank数
  let currentRank = 0;

  // ループ処理中、処理済みのhighscore数
  let higherScoreCount = 0;

  const rankingList: RankItemDocument[] = [];

  const allHighscores = await getHighscoreColRef()
    .where("game", "==", game)
    .orderBy("point", compareType)
    .get();

  // eslint-disable-next-line
  for (const scoreDoc of allHighscores.docs) {
    higherScoreCount += 1;
    const highscore = scoreDoc.data() as HighscoreDocument;

    // 同率考慮の計算
    // prev itemのpointより低評価の場合、rank数をあげる
    if (shouldUpdate(highscore.point, currentPoint)) {
      currentRank = higherScoreCount;
      currentPoint = highscore.point;
    }

    // eslint-disable-next-line
    const userSnapshot = await highscore.userRef.get();

    if (!userSnapshot.exists) {
      // TODO
    }

    const userDoc = userSnapshot.data() as UserDocument;

    const rankingDoc: RankItemDocument = {
      uid: userDoc.uid,
      userName: userDoc.displayName,
      member: highscore.member,
      rank: currentRank,
      point: highscore.point,
    };

    rankingList.push(rankingDoc);
  }

  return rankingList;
}
