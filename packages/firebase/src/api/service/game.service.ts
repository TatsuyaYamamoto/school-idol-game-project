import { firestore } from "firebase-admin";
import { Injectable } from "@nestjs/common";

import type { Member, MetadataDocument } from "@sokontokoro/mikan";

@Injectable()
export class GameService {
  async getRanking(
    game: string,
    lastVisibleId?: string
  ): Promise<{
    updatedAt: Date;
    scores: {
      id: string;
      uid: string;
      userName: string;
      member: Member;
      rank: number;
      point: number;
    }[];
  }> {
    const limit = 10;
    const metadataRef = firestore().collection("metadata").doc(game);
    const metadata = (await metadataRef.get()).data() as MetadataDocument;

    let baseQuery = metadata.rankingRef
      .collection("list")
      .orderBy("point", "desc")
      .limit(limit);

    if (lastVisibleId) {
      const lastVisibleSnap = await metadata.rankingRef
        .collection("list")
        .doc(lastVisibleId)
        .get();
      baseQuery = baseQuery.startAfter(lastVisibleSnap);
    }

    const scoresSnap = await baseQuery.get();

    if (scoresSnap.empty) {
      // @ts-ignore
      return { updatedAt: metadata.updatedAt.toDate(), scores: [] };
    }

    const scores = scoresSnap.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        userName: data.userName,
        member: data.member,
        rank: data.rank,
        point: data.point,
      };
    });
    // @ts-ignore
    return { updatedAt: metadata.updatedAt.toDate(), scores };
  }
}
