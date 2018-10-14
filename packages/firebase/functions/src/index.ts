import * as functions from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

import onCreatePlaylog from "./trigger/onCreatePlaylog";

import generateRanking from "./pubsub/generateRanking";
import cloudFunctionsWarnLog from "./pubsub/cloudFunctionsWarnLog";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true
});

export const helloWorld = functions.https.onRequest((_request, response) => {
  response.send("Hello from Firebase!");
});

// Trigger
export { onCreatePlaylog };

// pubsub
export { cloudFunctionsWarnLog, generateRanking };
