import { config } from "firebase-functions";
import { IncomingWebhook, IncomingWebhookResult } from "@slack/webhook";

export const slackWebhook = new IncomingWebhook(config().slack.webhook_url);

export const sendToSlackAsNewUserNotif = (params: {
  uid: string;
  userDocUrl: string;
  referer: string;
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
            text: "*Referer*",
          },
          {
            type: "mrkdwn",
            text: `${uidLink}`,
          },
          {
            type: "mrkdwn",
            text: `${params.referer}`,
          },
        ],
      },
    ],
  });
};
