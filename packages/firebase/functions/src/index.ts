import * as functions from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

import onCreateUser from "./trigger/onCreateUser";
import onDeleteUser from "./trigger/onDeleteUser";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true
});

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Trigger
export { onCreateUser, onDeleteUser };
