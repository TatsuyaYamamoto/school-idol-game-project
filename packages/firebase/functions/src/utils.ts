import { firestore } from "firebase-admin";

export function getHighscoreColRef() {
  return firestore().collection("highscores");
}

export async function getHighscoreSnapshot(game, userRef) {
  const snapshot = await getHighscoreColRef()
    .where("game", "==", game)
    .where("userRef", "==", userRef)
    .get();

  if (snapshot.empty) {
    return null;
  } else {
    return snapshot.docs[0];
  }
}

export type compare = (prev: number, next: number) => boolean;

export function getCompare(compareType: "desc" | "asc"): compare {
  if (compareType === "desc") {
    return (prev: number, next: number) => {
      return prev < next;
    };
  }

  if (compareType === "asc") {
    return (prev: number, next: number) => {
      return next < prev;
    };
  }

  throw new Error("undefined compare type.");
}
