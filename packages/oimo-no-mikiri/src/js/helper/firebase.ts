import firebase from "firebase/app";
import { FirebaseClient } from "@sokontokoro/mikan";

export function init(): Promise<firebase.User> {
  FirebaseClient.database.ref(".info/connected").on("value", (snapshot) => {
    const user = FirebaseClient.auth.currentUser;
    if (!user) {
      return;
    }

    if (snapshot.exists()) {
      const ownRef = FirebaseClient.database.ref(
        `/oimo-no-mikiri/users/${user.uid}/isConnecting`
      );
      ownRef.set(true);
      ownRef.onDisconnect().set(false);
    }
  });

  FirebaseClient.auth.signInAnonymously();

  return new Promise<firebase.User>((resolve) => {
    const unsubscribe = FirebaseClient.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("logged-in", user.uid);
        unsubscribe();
        resolve(user);
      }
    });
  });
}
