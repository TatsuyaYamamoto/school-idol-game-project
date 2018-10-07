import { auth, initializeApp, firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { devConfig } from "./config";

initializeApp(devConfig);

export const firebaseAuth = auth();

export const firebaseDb = firestore();
firebaseDb.settings({
  timestampsInSnapshots: true
});
