import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";

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
  slackWebhook,
} from "../utils";

const TARGET_GAMES: {
  name: Game;
  icon: string;
}[] = [
  { name: "honocar", icon: "ほ🚗" },
  { name: "shakarin", icon: "😺🎵" },
  { name: "maruten", icon: "💮👿" },
  { name: "yamidori", icon: "🐣🍲" },
  { name: "oimo-no-mikiri", icon: "🍠🍂" },
];

const sendToSlack = (params: {
  totalExecutionTimeMs: number;
  games: {
    name: string;
    icon: string;
    executionTimeMs: number;
    recordCount: number;
  }[];
}) => {
  const text = `:white_check_mark: generated ranking.`;

  return slackWebhook.send({
    text,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
        fields: [
          {
            type: "mrkdwn",
            text: "*Total Execution time*",
          },
          {
            type: "mrkdwn",
            text: "\n",
          },
          {
            type: "mrkdwn",
            text: `${params.totalExecutionTimeMs} ms`,
          },
        ],
      },
      ...params.games
        .map((game) => [
          {
            type: "divider",
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `${game.name} ${game.icon}`,
              },
              {
                type: "mrkdwn",
                text: "\n",
              },
              {
                type: "mrkdwn",
                text: "Execution time",
              },
              {
                type: "mrkdwn",
                text: `${game.executionTimeMs} ms`,
              },
              {
                type: "mrkdwn",
                text: "Record count",
              },
              {
                type: "mrkdwn",
                text: `${game.recordCount}`,
              },
            ],
          },
        ])
        .flat(),
    ],
  });
};

export default functions
  .runWith({ timeoutSeconds: 60 * 8 })
  .pubsub.schedule("00 09 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    console.log(`run scheduled "generate-ranking" job. ID: ${context.eventId}`);

    try {
      const resultData: {
        name: string;
        icon: string;
        executionTimeMs: number;
        recordCount: number;
      }[] = [];

      // eslint-disable-next-line
      for (const { name, icon } of TARGET_GAMES) {
        const generatingStartTimeMs = Date.now();
        console.log(`start creation. game: ${name}`);

        const metadataRef = getMetadataRef(name);
        const newRankingRef = firestore().collection("ranking").doc();
        const newRankingListRef = newRankingRef.collection("list");

        /**
         * step 1
         * Load all highscore resources and calculate ranking list.
         */
        // eslint-disable-next-line
        const rankingList = await createRankingList(name);

        console.log(
          `create ranking item docs. game: ${name}, size: ${rankingList.length}`
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
          game: name,
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

        console.log(`success! game: ${name}`);
        const generatingEndTimeMs = Date.now();

        resultData.push({
          name,
          icon,
          executionTimeMs: generatingEndTimeMs - generatingStartTimeMs,
          recordCount: rankingList.length,
        });
      }

      console.log(
        `It's completed to create ranking; ${TARGET_GAMES.join(", ")}.`
      );

      await sendToSlack({
        totalExecutionTimeMs: resultData
          .map((datum) => datum.executionTimeMs)
          .reduce((prev, current) => prev + current),
        games: resultData,
      });
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
