import { initializeApp, firestore } from "firebase-admin";
import * as functions from "firebase-functions";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true,
});

/* eslint-disable import/first */
import { getExpressInstance } from "./api";

import version from "./https/version";
import p2pCredential from "./https/p2pCredential";

import onCreatePlaylog from "./trigger/onCreatePlaylog";
import onWriteUser from "./trigger/onWriteUser";
import onUpdatePresence from "./trigger/onUpdatePresence";
import onUpdateRoom from "./trigger/onUpdateRoom";

import generateRanking from "./pubsub/generateRanking";
import cloudFunctionsWarnLog from "./pubsub/cloudFunctionsWarnLog";
/* eslint-enable import/first */

// api
export const api = functions
  .region("asia-northeast1")
  .https.onRequest(async (...args) => {
    const express = await getExpressInstance();
    express(...args);
  });

// https
export { version, p2pCredential };

// Trigger
export { onCreatePlaylog, onWriteUser, onUpdatePresence, onUpdateRoom };

// pubsub
export { cloudFunctionsWarnLog, generateRanking };
