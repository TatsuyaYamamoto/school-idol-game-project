import firebase from "firebase/app";

import { devConfig, proConfig } from "./config";

export class FirebaseClient {
  private static client: FirebaseClient;

  readonly app: firebase.app.App;

  private constructor() {
    const config =
      process.env.NODE_ENV === "production" ? proConfig : devConfig;
    this.app = firebase.initializeApp(config);
  }

  public static get instance(): FirebaseClient {
    if (!this.client) {
      this.client = new FirebaseClient();
    }
    return this.client;
  }

  public static get auth(): firebase.auth.Auth {
    return FirebaseClient.instance.app.auth();
  }

  public static get database(): firebase.database.Database {
    return FirebaseClient.instance.app.database();
  }

  public static get firestore(): firebase.firestore.Firestore {
    return FirebaseClient.instance.app.firestore();
  }
}
