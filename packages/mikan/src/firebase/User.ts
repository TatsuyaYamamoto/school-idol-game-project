import {
  User as FirebaseUser,
  UserInfo as FirebaseUserInfo,
  auth,
  firestore
} from "firebase/app";

import UserCredential = firebase.auth.UserCredential;

import { Twitter } from "twit";
import TwitterUser = Twitter.User;

import { firebaseAuth, firebaseDb } from "./index";

export interface UserDocument extends firestore.DocumentData {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
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
       * Credential as IdP's user.
       */

      credential:
        | {
            // for twitter
            accessToken: string;
            secret: string;
          }
        | {};

      /**
       * Time that the user is lined to IdP's account.
       */
      linkedAt: firestore.FieldValue;
    };
  };
  createdAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
}

export class User {
  private constructor(readonly firebaseUser: FirebaseUser) {}

  public static getColRef() {
    return firebaseDb.collection("users");
  }

  public static getDocRef(id: string) {
    return User.getColRef().doc(id);
  }

  public static getOwnRef() {
    const { currentUser } = firebaseAuth;

    return User.getDocRef(currentUser.uid);
  }

  public static async linkIdp(userCredential: UserCredential) {
    const { user, additionalUserInfo, credential } = userCredential;

    const providerId = credential.signInMethod;
    const userRef = User.getDocRef(user.uid);
    const currentUserDoc = (await userRef.get()).data() as UserDocument;
    const currentProviders = currentUserDoc.providers || {};
    const isFirstLink = Object.keys(currentProviders).length === 0;

    if (!isFirstLink && currentUserDoc.providers[providerId]) {
      throw new Error(`received duplicated IdP's credential; ${providerId} `);
    }

    if (providerId === "twitter.com") {
      const profile = additionalUserInfo.profile as TwitterUser;

      const newDoc = {
        ...currentUserDoc,
        providers: {
          ...currentUserDoc.providers,
          [providerId]: {
            userId: profile.id_str,
            credential: {
              accessToken: credential["accessToken"],
              secret: credential["secret"]
            },
            linkedAt: firestore.FieldValue.serverTimestamp()
          }
        }
      };

      if (isFirstLink) {
        newDoc.displayName = profile.name;
        newDoc.isAnonymous = false;
      }

      await userRef.update(newDoc);
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

  private getLinkedProviderData(): FirebaseUserInfo | null {
    return this.firebaseUser.providerData.find(data => {
      return data.uid !== null;
    });
  }
}
