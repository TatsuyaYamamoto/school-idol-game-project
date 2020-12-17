import { firestore, auth } from "firebase-admin";
import { Injectable } from "@nestjs/common";

import {
  credentialColRef,
  UserDoc,
  CredentialDoc,
  userDocRef,
} from "../../helper/firestore";
import { getRandomAnonymousName } from "../../helper/anonymous";

@Injectable()
export class UserService {
  async getById(uid: string): Promise<UserDoc | undefined> {
    const ref = userDocRef(uid);
    const snap = await ref.get();
    return snap.data();
  }

  public async create(uid: string): Promise<UserDoc> {
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

    const newUserDoc: UserDoc = {
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
    };

    await newUserDocRef.set(newUserDoc);
    return newUserDoc;
  }

  public async link(
    params: {
      uid: string;
      duplicatedUid?: string;
    } & {
      provider: {
        id: "twitter.com";
        userId: string;
        displayName: string;
        photoUrl: string;
        accessToken: string;
        secret: string;
      };
    }
  ): Promise<UserDoc> {
    // Update target user
    const userRef = userDocRef(params.uid);
    const userSnap = await userRef.get();
    const userDoc = userSnap.data();
    if (!userDoc) {
      throw new Error(`link target user is not found. uid: ${params.uid}`);
    }

    // userを読み込んで、link済みのproviderか確認する
    // link済み => 既存のCredential docを更新
    // 未link   => 新しいCredential docを作成
    const linkedProvider = userDoc.providers[params.provider.id];
    const isNewCredentialForIdp = !linkedProvider;
    const credentialRef = isNewCredentialForIdp
      ? credentialColRef.doc()
      : linkedProvider.credentialRef;

    if (params.provider.id === "twitter.com") {
      const batch = firestore().batch();

      // create batch of creation or updating credential
      const newCredentialDoc: Partial<CredentialDoc> = {
        providerId: params.provider.id,
        data: {
          accessToken: params.provider.accessToken,
          secret: params.provider.secret,
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
        userRef,
      };

      if (isNewCredentialForIdp) {
        newCredentialDoc.createdAt = firestore.FieldValue.serverTimestamp();
        batch.set(credentialRef, newCredentialDoc);
      } else {
        batch.update(credentialRef, newCredentialDoc);
      }

      // create batch of updating user
      const newUserDoc: Partial<UserDoc> = {
        isAnonymous: false,
        displayName: params.provider.displayName,
        photoURL: params.provider.photoUrl,
      };

      newUserDoc.providers = {
        ...newUserDoc.providers,
        [params.provider.id]: {
          userId: params.provider.userId,
          linkedAt: firestore.FieldValue.serverTimestamp(),
          credentialRef,
        },
      };

      if (params.duplicatedUid) {
        newUserDoc.duplicatedRefsByLink = [
          ...userDoc.duplicatedRefsByLink,
          userDocRef(params.duplicatedUid),
        ];
      }

      batch.update(userRef, newUserDoc);
      await batch.commit();

      const newUser = await userRef.get();
      return newUser.data() as UserDoc;
    }

    throw new Error(
      `provided provider; ${params.provider.id}, is not supported.`
    );
  }

  private getUserFromAuth = async (uid: string) => {
    try {
      return auth().getUser(uid);
    } catch (e) {
      return null;
    }
  };
}
