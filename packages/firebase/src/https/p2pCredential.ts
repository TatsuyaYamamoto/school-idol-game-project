import { https, config } from "firebase-functions";
import { HmacSHA256, enc as cryptoEnc } from "crypto-js";

const secretKey = config().skyway.secret_key;
const credentialTTL = 1 * 60 * 60; // 1 hour

function calculateAuthToken(peerId: string, timestamp: number) {
  // calculate the auth token hash
  const hash = HmacSHA256(`${timestamp}:${credentialTTL}:${peerId}`, secretKey);

  // convert the hash to a base64 string
  return cryptoEnc.Base64.stringify(hash);
}

export default https.onCall(async (data, context) => {
  if (!context.auth) {
    return {
      error: {
        status: "INVALID_ARGUMENT",
        message: "authenticated user only is allowed.",
      },
    };
  }

  const { peerId } = data;

  if (!peerId) {
    return {
      error: { status: "INVALID_ARGUMENT", message: "No peer ID is provided." },
    };
  }

  const unixTimestamp = Math.floor(Date.now() / 1000);

  return {
    timestamp: Math.floor(Date.now() / 1000), // SkyWay needs the current unix timestamp.
    ttl: credentialTTL,
    authToken: calculateAuthToken(peerId, unixTimestamp),
  };
});
