import * as functions from "firebase-functions";
import { initializeApp, firestore, credential } from "firebase-admin";

import onCreateUser from "./trigger/onCreateUser";
import onDeleteUser from "./trigger/onDeleteUser";
import onCreatePlaylog from "./trigger/onCreatePlaylog";
import onWriteHighscores from "./trigger/onWriteHighscores";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true
});

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Trigger
export { onCreateUser, onDeleteUser, onCreatePlaylog, onWriteHighscores };
