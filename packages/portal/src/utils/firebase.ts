import firebase from "firebase/app";
import "firebase/firestore";

export const firebaseApp =
  firebase.apps[0] ||
  firebase.initializeApp({
    apiKey: "AIzaSyA5ZR8XxctmC-o_v7Q5eTtzgcu4yupNtP8",
    authDomain: "school-idol-game-development.firebaseapp.com",
    databaseURL: "https://school-idol-game-development.firebaseio.com",
    projectId: "school-idol-game-development",
    storageBucket: "school-idol-game-development.appspot.com",
    messagingSenderId: "121430316162",
  });
