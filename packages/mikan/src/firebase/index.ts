import { auth, initializeApp, firestore, functions } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/database";

import { devConfig, proConfig } from "./config";

const config = process.env.NODE_ENV === "production" ? proConfig : devConfig;
initializeApp(config);

export const firebaseAuth = auth();

export const firebaseDb = firestore();
firebaseDb.settings({
  timestampsInSnapshots: true
});

export function callHttpsCallable(name: string, data: any): Promise<any> {
  return functions().httpsCallable(name)(data);
}
