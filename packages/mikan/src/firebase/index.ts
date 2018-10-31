import {
  auth,
  initializeApp,
  firestore,
  functions,
  database
} from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/database";

import { devConfig, proConfig } from "./config";
import { User } from "./User";
import { PresenceDbJson } from "./Presence";

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

// TODO consider multi device connection by the same user.
export function initWatchPresence(): string {
  const uid = User.getOwnRef().id;
  const infoConnectedRef = database().ref(".info/connected");
  const presencesRef = database().ref(`presences`);
  const newPresenceRef = presencesRef.push();
  const newPresenceId = newPresenceRef.key;

  const onlineState: PresenceDbJson = {
    uid,
    online: true,
    userAgent: navigator.userAgent,
    createdAt: database.ServerValue.TIMESTAMP
  };

  // since I can connect from multiple devices or browser tabs, we store each connection instance separately
  // any time that connectionsRef's value is null (i.e. has no children) I am offline
  // var myConnectionsRef = firebase.database().ref("users/joe/connections");

  // stores the timestamp of my last disconnect (the last time I was seen online)

  infoConnectedRef.on("value", function(snapshot) {
    if (snapshot && snapshot.val() === true) {
      // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
      // var con = ownPresenceRef.push();

      // When I disconnect, remove this device
      newPresenceRef.onDisconnect().update({
        online: false
      });

      // Add this device to my connections list
      // this value could contain info about the device or a timestamp too
      newPresenceRef.set(onlineState);
    }
  });

  if (!newPresenceId) {
    throw new Error("fail to issue new presence ID.");
  }

  return newPresenceId;
}
