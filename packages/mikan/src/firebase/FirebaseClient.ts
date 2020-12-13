import firebase from "firebase/app";

import { devConfig, proConfig, Config } from "./config";

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

  public static async post(params: {
    path: string;
    body: Record<string, unknown>;
  }): Promise<Response> {
    const baseUrl = FirebaseClient.apiFunctionsOrigin;
    const url = `${baseUrl}${params.path}`;
    const authUser = FirebaseClient.auth.currentUser;
    if (!authUser) {
      throw new Error("");
    }

    const idToken = await authUser.getIdToken();

    return fetch(url, {
      method: "POST",
      headers: {
        [`Authorization`]: `Bearer ${idToken}`,
        [`Content-Type`]: `application/json`,
      },
      body: JSON.stringify(params.body),
    });
  }

  public static get apiFunctionsOrigin(): string {
    const { app } = FirebaseClient.instance;
    const region = "asia-northeast1";
    const { projectId } = <Config>app.options;
    return `https://${region}-${projectId}.cloudfunctions.net`;
  }
}
