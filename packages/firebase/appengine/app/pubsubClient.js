const PubSub = require("@google-cloud/pubsub");

const pubsubClient = new PubSub({
  projectId: "school-idol-game-development"
});

function publish(topic, message) {
  return pubsubClient
    .topic(topic)
    .publisher()
    .publish(Buffer.from(JSON.stringify(message)));
}

module.exports = {
  publish
};
