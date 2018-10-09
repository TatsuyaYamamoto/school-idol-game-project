import * as functions from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

import onCreateUser from "./trigger/onCreateUser";
import onCreatePlaylog from "./trigger/onCreatePlaylog";
import onWriteHighscores from "./trigger/onWriteHighscores";

import cloudFunctionsWarnLog from "./pubsub/cloudFunctionsWarnLog";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true
});

export const helloWorld = functions.https.onRequest((_request, response) => {
  response.send("Hello from Firebase!");
});

// Trigger
export { onCreateUser, onCreatePlaylog, onWriteHighscores };

// pubsub
export { cloudFunctionsWarnLog };
