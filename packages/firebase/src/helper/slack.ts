import { config } from "firebase-functions";
import { IncomingWebhook, IncomingWebhookResult } from "@slack/webhook";

export const slackWebhook = new IncomingWebhook(config().slack.webhook_url);

export const sendToSlackAsNewUserNotif = (params: {
  uid: string;
  userDocUrl: string;
  xSkntkrSource: string;
}): Promise<IncomingWebhookResult> => {
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
            text: "*Source*",
          },
          {
            type: "mrkdwn",
            text: `${uidLink}`,
          },
          {
            type: "mrkdwn",
            text: `${params.xSkntkrSource}`,
          },
        ],
      },
    ],
  });
};

export const sendToSlackAsLinkedUserNotif = (params: {
  uid: string;
  displayName: string;
  userDocUrl: string;
  xSkntkrSource: string;
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
            text: "*Source*",
          },
          {
            type: "mrkdwn",
            text: "\n",
          },
          {
            type: "mrkdwn",
            text: `${params.xSkntkrSource}`,
          },
        ],
      },
    ],
  });
};
