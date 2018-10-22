const PubSub = require("@google-cloud/pubsub");

const pubsubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
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
