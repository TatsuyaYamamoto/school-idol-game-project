import firebase from "firebase/app";
import "firebase/firestore";

const config = JSON.parse(process.env.APP_FIREBASE_CONFIG || "");
const apiFunctionRegion = "asia-northeast1";

export const firebaseApp = firebase.apps[0] || firebase.initializeApp(config);

export const functionsOrigin = `https://${apiFunctionRegion}-${config.projectId}.cloudfunctions.net`;
