import { initializeApp, firestore } from "firebase-admin";

import version from "./https/version";
import p2pCredential from "./https/p2pCredential";

import onCreatePlaylog from "./trigger/onCreatePlaylog";
import onWriteUser from "./trigger/onWriteUser";
import onUpdatePresence from "./trigger/onUpdatePresence";
import onUpdateRoom from "./trigger/onUpdateRoom";

import generateRanking from "./pubsub/generateRanking";
import cloudFunctionsWarnLog from "./pubsub/cloudFunctionsWarnLog";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true,
});

// https
export { version, p2pCredential };

// Trigger
export { onCreatePlaylog, onWriteUser, onUpdatePresence, onUpdateRoom };

// pubsub
export { cloudFunctionsWarnLog, generateRanking };
