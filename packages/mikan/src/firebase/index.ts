import { auth, initializeApp, firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { devConfig, proConfig } from "./config";

const config = process.env.NODE_ENV === "production" ? proConfig : devConfig;
initializeApp(config);

export const firebaseAuth = auth();

export const firebaseDb = firestore();
firebaseDb.settings({
  timestampsInSnapshots: true
});
