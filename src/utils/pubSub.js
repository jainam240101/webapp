const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub();
const topicName = process.env.pubSub;

async function publishMessage(message) {
  const topic = pubSubClient.topic(topicName);
  const messageBuffer = Buffer.from(JSON.stringify(message));

  try {
    const messageId = await topic.publish(messageBuffer);
    return messageId;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  publishMessage,
};
