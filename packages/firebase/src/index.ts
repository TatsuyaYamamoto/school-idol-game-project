import * as functions from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

import p2pCredential from "./https/p2pCredential";

import onCreatePlaylog from "./trigger/onCreatePlaylog";
import onCreateRanking from "./trigger/onCreateRanking";
import onWriteUser from "./trigger/onWriteUser";
import onUpdatePresence from "./trigger/onUpdatePresence";

import generateRanking from "./pubsub/generateRanking";
import cloudFunctionsWarnLog from "./pubsub/cloudFunctionsWarnLog";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true
});

export const helloWorld = functions.https.onRequest((_request, response) => {
  response.send("Hello from Firebase!");
});

// https
export { p2pCredential };

// Trigger
export { onCreatePlaylog, onCreateRanking, onWriteUser, onUpdatePresence };

// pubsub
export { cloudFunctionsWarnLog, generateRanking };
