import { firestore } from "firebase-functions";
// eslint-disable-next-line import/no-extraneous-dependencies
import { RankingDocument } from "@sokontokoro/mikan";

import { catchErrorWrapper, getDocUrl, sendToSlack, slackUrl } from "../utils";

export default firestore.document("ranking/{rankingId}").onCreate(
  catchErrorWrapper(async (snapshot) => {
    const newRanking = snapshot.data() as RankingDocument;
    const { game } = newRanking;
    const consoleUrl = slackUrl(
      getDocUrl("ranking", snapshot.ref.id),
      "console"
    );

    await sendToSlack({
      text: `generated ranking of ${game}. ${consoleUrl}`,
    });
  })
);
