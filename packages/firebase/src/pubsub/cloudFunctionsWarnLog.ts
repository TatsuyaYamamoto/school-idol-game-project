import { pubsub } from "firebase-functions";

import { slackWebhook } from "../utils";

export default pubsub
  .topic("cloud-functions-warn-log")
  .onPublish(async (message, context) => {
    console.log({
      message: `subscribe "cloud-functions-warn-log" topic.`,
      detail: [message, context],
    });

    try {
      const data = JSON.parse(Buffer.from(message.data, "base64").toString());
      const {
        function_name: functionName,
        project_id: projectId,
      } = data.resource.labels;
      const executionId = context.eventId;

      const logUrl =
        `https://console.cloud.google.com/logs/viewer` +
        `?project=${projectId}` +
        `&advancedFilter=labels."execution_id"%3D"${executionId}"`;

      const title = `Catch unhandled error! *${functionName}* <${logUrl}|Open log>`;
      const text = JSON.stringify(data, null, "\t");
      const result = await slackWebhook.send({
        attachments: [
          {
            title,
            text,
            color: "danger",
          },
        ],
      });

      console.log({
        message: "slack nitif is success.",
        detail: result,
      });
    } catch (e) {
      console.log({
        message: "FATAL ERROR! Could not send slack webhook!",
        detail: e,
      });
    }
  });
