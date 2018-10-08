import { pubsub } from "firebase-functions";
import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/client";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_TO_FIREBASE || "";

const LOG_COLORS = {
  DEBUG: "#4175e1",
  INFO: "#76a9fa",
  WARNING: "warning",
  ERROR: "danger",
  CRITICAL: "#ff0000"
};

export default pubsub
  .topic("cloud-functions-warn-log")
  .onPublish(async (message, context) => {
    console.log({
      message: `subscribe "cloud-functions-warn-log" topic.`,
      detail: [message, context]
    });

    try {
      const data = JSON.parse(new Buffer(message.data, "base64").toString());
      const { function_name, project_id } = data.resource.labels;
      const executionId = context.eventId;

      const logUrl =
        `https://console.cloud.google.com/logs/viewer` +
        `?project=${project_id}` +
        `&advancedFilter=labels."execution_id"%3D"${executionId}"`;

      const title = `Catch unhandled error! *${function_name}* <${logUrl}|Open log>`;
      const text = JSON.stringify(data, null, "\t");

      const body: IncomingWebhookSendArguments = {
        attachments: [
          {
            title,
            text,
            color: (<any>LOG_COLORS)[data.severity]
          }
        ]
      };

      const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);
      const result = await webhook.send(body);

      console.log({
        message: "slack nitif is success.",
        detail: result
      });
    } catch (e) {
      console.log({
        message: "FATAL ERROR! Could not send slack webhook!",
        detail: e
      });
    }
  });
