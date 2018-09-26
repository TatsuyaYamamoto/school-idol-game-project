import { auth, firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import DocumentReference = firestore.DocumentReference;

import { getLogger } from "../logger";

const logger = getLogger("mikan/firebase/db");

export interface PlayLogDocument {
  userRef: firestore.DocumentReference;
  game: string;
  member: string;
  data: object;
  createdAt: firestore.FieldValue;
  userAgent: string;
  locale: string;
}

export interface ScoreDocument {
  userRef: firestore.DocumentReference;
  game: string;
  member: string;
  data: object;
  count: number;
  createdAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
}

export interface UserDocument {
  uid: string;
  twitterId: string;
  displayName: string;
  accessToken: string;
  accessTokenSecret: string;
  isAnonymous: boolean;
  createdAt: firestore.FieldValue;
  linkedAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
}

export function postScore(
  game,
  member: string,
  data: any,
  compare: (prev, next) => boolean
) {
  const { currentUser } = auth();
  const userRef = firestore()
    .collection("users")
    .doc(currentUser.uid);

  const playLogDoc: PlayLogDocument = {
    userRef,
    game,
    member,
    data,
    createdAt: firestore.FieldValue.serverTimestamp(),
    userAgent: navigator.userAgent,
    locale: navigator.language
  };

  const savePlayLogPromise = firestore()
    .collection("playlogs")
    .add(playLogDoc);

  const saveScorePromise = firestore()
    .collection("games")
    .doc(game)
    .collection("scores")
    .where("user", "==", userRef)
    .get()
    .then<DocumentReference | void>(snapshot => {
      if (snapshot.empty) {
        return firestore()
          .collection("games")
          .doc(game)
          .collection("scores")
          .add({});
      } else {
        const prevData = snapshot.docs[0].data().data;
        const update: any | ScoreDocument = {
          count: snapshot.docs[0].data().count++,
          updatedAt: firestore.FieldValue.serverTimestamp()
        };

        if (compare(prevData, data)) {
          update["data"] = data;
        }

        return firestore()
          .collection("games")
          .doc(game)
          .collection("scores")
          .doc(snapshot.docs[0].id)
          .update(update);
      }
    });

  return Promise.all([savePlayLogPromise, saveScorePromise]);
}

export async function mergeUsers() {
  // const duplicateUserRef = firestore()
  //   .collection("users")
  //   .doc(duplicatedUser.uid);
  //
  // const userRef = firestore()
  //   .collection("users")
  //   .doc(user.uid);
  //
  // duplicateUserRef.get().then(snapshot => {
  //   const doc = snapshot.data();
  // });
  //
  // firestore()
  //   .collection("games")
  //   .get()
  //   .then(snapshot => {
  //     for (const doc of snapshot.docs) {
  //       firestore()
  //         .collection("games")
  //         .doc(doc.id)
  //         .collection("scores")
  //         .where("user", "==", duplicatedUser.uid)
  //         .get();
  //     }
  //   });
  //
  // await Promise.all([duplicateUserRef.delete(), duplicatedUser.delete()]);
}
