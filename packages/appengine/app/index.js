const express = require("express");
const { publish } = require("./pubsubClient");
const { sendInfo } = require("./slackClient");

const app = express();

const TOPIC_GENERATE_RANKING = "generate-ranking";

// TODO prevent anyone can call.
app.get(`/publish/${TOPIC_GENERATE_RANKING}`, async (req, res) => {
  try {
    const publishResponse = await publish(TOPIC_GENERATE_RANKING, {});

    console.log({
      message: `Published to ${TOPIC_GENERATE_RANKING}`,
      detail: publishResponse
    });

    res.json({ message: `Published to ${TOPIC_GENERATE_RANKING}` });
  } catch (e) {
    console.error({
      message: "fail to publish",
      detail: e
    });

    res.status(500).json({ message: e.message });
  }
});

app.get("/", (req, res) => {
  res.send("[functions-cron]: Hello, world!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
