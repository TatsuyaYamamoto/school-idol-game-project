const { IncomingWebhook } = require("@slack/client");

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL || "");

const LOG_COLORS = {
  DEBUG: "#4175e1",
  INFO: "#76a9fa",
  WARNING: "warning",
  ERROR: "danger",
  CRITICAL: "#ff0000"
};

function sendInfo(title, text) {
  return webhook.send({
    attachments: [
      {
        title,
        text,
        color: LOG_COLORS.INFO
      }
    ]
  });
}

module.exports = {
  sendInfo
};
