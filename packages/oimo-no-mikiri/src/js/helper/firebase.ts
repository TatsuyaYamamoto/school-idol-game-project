import firebase from "firebase";

import { FIREBASE_OPTIONS } from "../Constants";

export function init() {
  firebase.initializeApp(FIREBASE_OPTIONS);

  firebase
    .database()
    .ref(".info/connected")
    .on("value", (snapshot) => {
      const user = firebase.auth().currentUser;
      if (!user) {
        return;
      }

      if (snapshot.exists()) {
        const ownRef = firebase
          .database()
          .ref(`/users/${user.uid}/isConnecting`);
        ownRef.set(true);
        ownRef.onDisconnect().set(false);
      }
    });

  firebase.auth().signInAnonymously();

  return new Promise<firebase.User>((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("logged-in", user.uid);
        unsubscribe();
        resolve(user);
      }
    });
  });
}
