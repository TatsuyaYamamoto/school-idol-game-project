import { firestore as adminFirestore } from "firebase-admin";
import { MetadataDocument } from "@sokontokoro/mikan";

export function getHighscoreColRef() {
  return adminFirestore().collection("highscores");
}

export async function getHighscoreSnapshot(
  game: string,
  userRef: /* adminFirestore.DocumentReference */ any
): Promise<adminFirestore.DocumentSnapshot | null> {
  const snapshot = await getHighscoreColRef()
    .where("game", "==", game)
    .where("userRef", "==", userRef)
    .get();

  if (snapshot.empty) {
    return null;
  }

  if (!snapshot.docs[0].exists) {
    return null;
  }

  return snapshot.docs[0];
}

export function getMetadataRef(game: string): adminFirestore.DocumentReference {
  return adminFirestore()
    .collection("metadata")
    .doc(game);
}

export async function loadedMetadata(game: string): Promise<MetadataDocument> {
  const metadataSnapshot = await getMetadataRef(game).get();

  if (!metadataSnapshot.exists) {
    throw new Error(`fatal error! ${game}'s metadata is not registered!`);
  }

  return metadataSnapshot.data() as MetadataDocument;
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

/**
 * {@link maxSize}毎に、batchを実行する
 * batchの最大実行件数を超えないように計算対象のDocumentを分割して実行する
 *
 * {@link https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja}
 */
// TODO fix poor efficiency
export async function addDocWithBatch(
  listRef: /* firestore.CollectionReference */ any,
  docList: adminFirestore.DocumentData[],
  maxSize: number = 100
) {
  for (let i = 0; i < docList.length; i += maxSize) {
    const start = i;
    const end = i + maxSize;

    const batch = adminFirestore().batch();
    for (const doc of docList.slice(start, end)) {
      if (doc) {
        batch.set(listRef.doc(), doc);
      }
    }
    await batch.commit();
  }
}
