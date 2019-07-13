import { https, config } from "firebase-functions";
import * as Twitter from "twitter";

const client = new Twitter({
  consumer_key: config().twitter.consumer_key,
  consumer_secret: config().twitter.consumer_secret,
  access_token_key: config().twitter.access_token_key,
  access_token_secret: config().twitter.access_token_secret
});

export default https.onCall(async (data, context) => {
  const { mediaData } = data;

  if (!mediaData) {
    return {
      error: true,
      message: "mediaData is required."
    };
  }

  try {
    const { media_id_string } = await client.post("media/upload", {
      media_data: mediaData
    });
    const status = await client.post("statuses/update.json", {
      status: `${context.rawRequest.path}/${
        process.env.GCLOUD_PROJECT
      }/${new Date().toDateString()}`,
      media_ids: media_id_string
    });

    return {
      url: status.entities.media[0].url
    };
  } catch (e) {
    console.error("error", e);

    return {
      error: true,
      message: e.message
    };
  }
});
