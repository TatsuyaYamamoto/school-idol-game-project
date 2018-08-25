import { initializeApp, auth, database } from "firebase";

import { FIREBASE_OPTIONS } from "../Constants";

export function init() {
  initializeApp(FIREBASE_OPTIONS);

  database()
    .ref(".info/connected")
    .on("value", snapshot => {
      const user = auth().currentUser;
      if (!user) {
        return;
      }

      if (snapshot.exists()) {
        const ownRef = database().ref(`/users/${user.uid}/isConnecting`);
        ownRef.set(true);
        ownRef.onDisconnect().set(false);
      }
    });

  auth().signInAnonymously();
}
