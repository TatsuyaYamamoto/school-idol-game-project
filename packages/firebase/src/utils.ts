import { firestore as adminFirestore } from "firebase-admin";
import { config, EventContext } from "firebase-functions";

import { IncomingWebhook, IncomingWebhookResult } from "@slack/client";
import { MetadataDocument } from "@sokontokoro/mikan";

const webhook = new IncomingWebhook(config().slack.webhook_url);

export function getHighscoreColRef(): adminFirestore.CollectionReference {
  return adminFirestore().collection("highscores");
}

export function getMetadataRef(game: string): adminFirestore.DocumentReference {
  return adminFirestore().collection("metadata").doc(game);
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
  // eslint-disable-next-line
  listRef: /* firestore.CollectionReference */ any,
  docList: adminFirestore.DocumentData[],
  maxSize = 100
): Promise<void> {
  for (let i = 0; i < docList.length; i += maxSize) {
    const start = i;
    const end = i + maxSize;

    const batch = adminFirestore().batch();
    // eslint-disable-next-line
    for (const doc of docList.slice(start, end)) {
      if (doc) {
        batch.set(listRef.doc(), doc);
      }
    }
    // eslint-disable-next-line
    await batch.commit();
  }
}

/**
 * @see catchErrorWrapper
 */
// eslint-disable-next-line
type Handler<T> = (value: T, context: EventContext) => PromiseLike<any>;

/**
 * unhandled errorをthrowさせないためのtry-catch wrapper function
 *
 * @param fn
 */
export function catchErrorWrapper<T>(fn: Handler<T>): Handler<T> {
  return async (change, context) => {
    try {
      await fn(change, context);
    } catch (e) {
      console.error({
        message: "FATAL ERROR! catch unhandled error.",
        detail: e,
      });
    }
  };
}

export function getDocUrl(collection: string, id: string): string {
  return `https://console.firebase.google.com/u/0/project/${process.env.GCLOUD_PROJECT}/database/firestore/data~2F${collection}~2F${id}`;
}

export function slackUrl(url: string, text: string): string {
  return `<${url}|${text}>`;
}

export function sendToSlack({
  title,
  text,
  color = "good",
}: {
  title?: string;
  text: string;
  color?: "good" | "warning" | "danger";
}): Promise<IncomingWebhookResult> {
  return webhook.send({
    attachments: [
      {
        title,
        text,
        color,
      },
    ],
  });
}
