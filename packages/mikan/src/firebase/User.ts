import {
  User as FirebaseUser,
  UserInfo as FirebaseUserInfo,
  firestore
} from "firebase/app";

import UserCredential = firebase.auth.UserCredential;
import DocumentReference = firestore.DocumentReference;

import { Twitter } from "twit";
import TwitterUser = Twitter.User;

import { firebaseAuth, firebaseDb } from "./index";
import { Credential, CredentialDocument } from "./Credential";

export interface UserDocument /* extends firestore.DocumentData */ {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
  photoURL: string | null;
  highscoreRefs: {
    [game: string]: firestore.DocumentReference;
  };

  /**
   * Additional provider-specific information.
   * Add item after {@link auth#linkWithRedirect}.
   */
  providers: {
    /**
     * string constant identifying each providers.
     */
    [providerId: string]: {
      /**
       * User ID in IdP
       */
      userId: string;
      /**
       * Credential reference as IdP's user.
       *
       * @link CredentialDocument
       */
      credentialRef: DocumentReference;

      /**
       * Time that the user is lined to IdP's account.
       */
      linkedAt: firestore.FieldValue | Date;
    };
  };
  createdAt: firestore.FieldValue | Date;
  updatedAt: firestore.FieldValue | Date;
  duplicatedRefsByLink: firestore.DocumentReference[];
}

export class User {
  private constructor(readonly firebaseUser: FirebaseUser) {}

  public static getColRef() {
    return firebaseDb.collection("users");
  }

  public static getDocRef(id: string) {
    return User.getColRef().doc(id);
  }

  public static getOwnRef(): DocumentReference {
    const { currentUser } = firebaseAuth;

    if (!currentUser) {
      throw new Error("No firebase auth current user.");
    }

    return User.getDocRef(currentUser.uid);
  }

  public static async linkIdp(userCredential: UserCredential) {
    const { user, additionalUserInfo, credential } = userCredential;

    if (!user || !additionalUserInfo || !credential) {
      throw new Error("Fail to link. No userCredential is provided.");
    }

    const { providerId } = credential;
    const currentUserRef = User.getDocRef(user.uid);
    const currentUserDoc = (await currentUserRef.get()).data() as UserDocument;
    const currentProviders = currentUserDoc.providers || {};
    const newCredentialRef = Credential.getColRef().doc();
    const isFirstLink = Object.keys(currentProviders).length === 0;

    if (!isFirstLink && currentUserDoc.providers[providerId]) {
      throw new Error(`received duplicated IdP's credential; ${providerId} `);
    }

    if (providerId === "twitter.com") {
      const profile = additionalUserInfo.profile as TwitterUser;

      const newCredential: CredentialDocument = {
        userRef: currentUserRef,
        providerId: providerId,
        data: {
          accessToken: (<any>credential).accessToken,
          secret: (<any>credential).secret
        }
      };

      const updatedUserDoc: UserDocument = {
        ...currentUserDoc,
        isAnonymous: false,
        providers: {
          ...currentUserDoc.providers,
          [providerId]: {
            userId: profile.id_str,
            linkedAt: firestore.FieldValue.serverTimestamp(),
            credentialRef: newCredentialRef
          }
        }
      };

      if (isFirstLink) {
        updatedUserDoc.displayName = profile.name;
        updatedUserDoc.photoURL = profile.profile_image_url_https;
      }

      await firestore().runTransaction(async transaction => {
        await transaction.update(currentUserRef, updatedUserDoc);
        await transaction.set(newCredentialRef, newCredential);
      });

      return;
    }

    throw new Error(`provided provider; ${providerId}, is not supported.`);
  }

  public static from(firebaseUser: FirebaseUser) {
    return new User(firebaseUser);
  }

  get isAnonymous(): boolean {
    return this.firebaseUser.isAnonymous;
  }

  get uid(): string {
    return this.firebaseUser.uid;
  }

  get displayName(): string | null {
    if (this.firebaseUser.displayName) {
      return this.firebaseUser.displayName;
    }

    const linkedProviderData = this.getLinkedProviderData();

    if (linkedProviderData) {
      return linkedProviderData.displayName;
    }

    return null;
  }

  get photoURL(): string | null {
    if (this.firebaseUser.photoURL) {
      return this.firebaseUser.photoURL;
    }

    const linkedProviderData = this.getLinkedProviderData();

    if (linkedProviderData) {
      return linkedProviderData.photoURL;
    }

    return null;
  }

  public async addDuplicatedRef(duplicate: User) {
    const duplicateUserRef = firestore()
      .collection("users")
      .doc(duplicate.uid);

    const alreadyLinkedUserRef = firestore()
      .collection("users")
      .doc(this.uid);

    const alreadyLinkedUserDoc = (await alreadyLinkedUserRef.get()).data() as UserDocument;
    const duplicatedRefsByLink =
      alreadyLinkedUserDoc.duplicatedRefsByLink || [];
    duplicatedRefsByLink.push(duplicateUserRef);

    const doc: UserDocument = {
      ...alreadyLinkedUserDoc,
      duplicatedRefsByLink
    };

    await alreadyLinkedUserRef.update(doc);
  }

  private getLinkedProviderData(): FirebaseUserInfo | null {
    const providerData = this.firebaseUser.providerData.find(
      data => !!data && data.uid !== null
    );

    return providerData || null;
  }
}
