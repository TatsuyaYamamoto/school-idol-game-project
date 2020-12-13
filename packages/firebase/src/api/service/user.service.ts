import { firestore, auth } from "firebase-admin";
import { Injectable } from "@nestjs/common";
import { UserDocument } from "@sokontokoro/mikan";

import { userDocRef } from "../../helper/firestore";
import { getRandomAnonymousName } from "../../helper/anonymous";

@Injectable()
export class UserService {
  async getById(uid: string): Promise<UserDocument | undefined> {
    const ref = userDocRef(uid);
    const snap = await ref.get();
    return snap.data();
  }

  async create(uid: string, debug?: boolean): Promise<UserDocument> {
    const newUserDocRef = userDocRef(uid);

    const [authCheckResult, firestoreCheckResult] = await Promise.all([
      this.getUserFromAuth(uid),
      newUserDocRef.get(),
    ]);

    if (!authCheckResult) {
      throw new Error(`provided user is not registered in auth. uid: ${uid}`);
    }

    if (firestoreCheckResult.exists) {
      throw new Error(`provided user is already registered in db. uid: ${uid}`);
    }

    const newUserDoc: UserDocument = {
      uid,
      isAnonymous: true,
      displayName: getRandomAnonymousName(),
      photoURL: null,
      highscoreRefs: {},
      providers: {},
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      duplicatedRefsByLink: [],
      presenceRefs: {},
      debug,
    };

    await newUserDocRef.set(newUserDoc);
    return newUserDoc;
  }

  private getUserFromAuth = async (uid: string) => {
    try {
      return auth().getUser(uid);
    } catch (e) {
      return null;
    }
  };
}
