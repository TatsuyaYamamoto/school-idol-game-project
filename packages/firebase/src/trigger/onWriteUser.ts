import { firestore } from "firebase-functions";

// eslint-disable-next-line import/no-extraneous-dependencies
import { UserDocument } from "@sokontokoro/mikan";

import { catchErrorWrapper, getDocUrl, slackWebhook } from "../utils";

const sendToSlackAsNewUserNotif = (params: {
  uid: string;
  userDocUrl: string;
  game: string;
}) => {
  const text = `:raised_hands: new user joined!`;
  const uidLink = `<${params.userDocUrl}|${params.uid}>`;

  return slackWebhook.send({
    text,
    blocks: [
      {
        type: "section",
        text: {
          text,
          type: "mrkdwn",
        },
        fields: [
          {
            type: "mrkdwn",
            text: "*UID*",
          },
          {
            type: "mrkdwn",
            text: "*Game*",
          },
          {
            type: "mrkdwn",
            text: `${uidLink}`,
          },
          {
            type: "mrkdwn",
            text: `${params.game}`,
          },
        ],
      },
    ],
  });
};

const sendToSlackAsLinkedUserNotif = (params: {
  uid: string;
  displayName: string;
  userDocUrl: string;
  game: string;
}) => {
  const text = `:victory_hand: user linked!`;
  const uidLink = `<${params.userDocUrl}|${params.uid}>`;

  return slackWebhook.send({
    text,
    blocks: [
      {
        type: "section",
        text: {
          text,
          type: "mrkdwn",
        },
        fields: [
          {
            type: "mrkdwn",
            text: "*UID*",
          },
          {
            type: "mrkdwn",
            text: "*Display Name*",
          },
          {
            type: "mrkdwn",
            text: `${uidLink}`,
          },
          {
            type: "mrkdwn",
            text: `${params.displayName}`,
          },
          {
            type: "mrkdwn",
            text: "*Game*",
          },
          {
            type: "mrkdwn",
            text: "\n",
          },
          {
            type: "mrkdwn",
            text: `${params.game}`,
          },
        ],
      },
    ],
  });
};

export default firestore.document("users/{userId}").onWrite(
  catchErrorWrapper(async (change) => {
    const afterUser = change.after.data() as UserDocument;

    if (!change.before.exists) {
      console.log("received event of creation.");

      const userDocUrl = await getDocUrl("users", afterUser.uid);
      await sendToSlackAsNewUserNotif({
        uid: afterUser.uid,
        userDocUrl,
        game: "TODO",
      });
      return;
    }

    const beforeUser = change.before.data() as UserDocument;

    if (Object.keys(beforeUser.providers) < Object.keys(afterUser.providers)) {
      console.log("received event of link updating.");

      const userDocUrl = getDocUrl("users", afterUser.uid);
      const { displayName } = afterUser;

      await sendToSlackAsLinkedUserNotif({
        uid: afterUser.uid,
        userDocUrl,
        displayName,
        game: "TODO",
      });
      return;
    }

    console.log("received undefined event.", beforeUser, afterUser);
  })
);
