import { FirebaseClient } from "@sokontokoro/mikan";

export function init(): void {
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
}
