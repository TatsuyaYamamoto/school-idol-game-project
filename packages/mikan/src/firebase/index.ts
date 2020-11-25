import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/database";

import { devConfig, proConfig } from "./config";

const config = process.env.NODE_ENV === "production" ? proConfig : devConfig;
firebase.initializeApp(config);

export const firebaseAuth = firebase.auth();

export const firebaseDb = firebase.firestore();
firebaseDb.settings({
  // it's now enabled by v5.8 or later
  // timestampsInSnapshots: true
});

export function callHttpsCallable(name: string, data: any): Promise<any> {
  return firebase.functions().httpsCallable(name)(data);
}
