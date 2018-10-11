import { pubsub } from "firebase-functions";

import { sendToSlack } from "../utils";

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
      const result = await sendToSlack(title, text, "danger");

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
