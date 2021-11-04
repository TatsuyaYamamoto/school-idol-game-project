import { initializeApp, FirebaseApp } from "firebase/app";

export const devConfig = {
  apiKey: "AIzaSyA5ZR8XxctmC-o_v7Q5eTtzgcu4yupNtP8",
  authDomain: "school-idol-game-development.firebaseapp.com",
  databaseURL: "https://school-idol-game-development.firebaseio.com",
  projectId: "school-idol-game-development",
  storageBucket: "school-idol-game-development.appspot.com",
  messagingSenderId: "121430316162",
};

export const proConfig = {
  apiKey: "AIzaSyBxTclDDetB4jMc5BTtlr4NrE_BkfLkzLQ",
  authDomain: "school-idol-game-production.firebaseapp.com",
  databaseURL: "https://school-idol-game-production.firebaseio.com",
  projectId: "school-idol-game-production",
  storageBucket: "school-idol-game-production.appspot.com",
  messagingSenderId: "1018493283718",
};

export const initFirebaseApp = (): FirebaseApp => {
  const config = process.env.NODE_ENV === "production" ? proConfig : devConfig;
  const app = initializeApp(config);
  return app;
};
