import firebase from "firebase/app";

// eslint-disable-next-line
import { Twitter } from "twit";

import { FirebaseClient } from "./FirebaseClient";
import { Credential, CredentialDocument } from "./Credential";
import { getRandomAnonymousName } from "..";

type FirebaseUser = firebase.User;
type FieldValue = firebase.firestore.FieldValue;
type UserCredential = firebase.auth.UserCredential;
type DocumentReference = firebase.firestore.DocumentReference;
type AdditionalUserInfo = firebase.auth.AdditionalUserInfo;
type AuthCredential = firebase.auth.AuthCredential;
import TwitterUser = Twitter.User;

export interface ProviderData {
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
  linkedAt: FieldValue | Date;
}

export interface UserDocument /* extends firestore.DocumentData */ {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
  photoURL: string | null;
  highscoreRefs: {
    [game: string]: DocumentReference;
  };

  /**
   * Additional provider-specific information.
   * Add item after {@link auth#linkWithRedirect}.
   * @link ProviderId
   */
  providers: {
    [providerId: string]: ProviderData;
  };
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
  duplicatedRefsByLink: DocumentReference[];
  presenceRefs: {
    [presenceId: string]: DocumentReference;
  };
  debug?: boolean;
}

export class User {
  public static getColRef(): firebase.firestore.CollectionReference {
    return FirebaseClient.firestore.collection("users");
  }

  public static getDocRef(id: string): firebase.firestore.DocumentReference {
    return User.getColRef().doc(id);
  }

  public static getOwnRef(): DocumentReference {
    const { currentUser } = FirebaseClient.auth;

    if (!currentUser) {
      throw new Error("No firebase auth current user.");
    }

    return User.getDocRef(currentUser.uid);
  }

  public static async create(user: FirebaseUser): Promise<void> {
    const newDocRef = User.getColRef().doc(user.uid);

    const doc: UserDocument = {
      uid: user.uid,
      isAnonymous: true,
      displayName: getRandomAnonymousName(),
      photoURL: null,
      highscoreRefs: {},
      providers: {},
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      duplicatedRefsByLink: [],
      presenceRefs: {},
    };

    /**
     * DEBUG用ユーザー
     * {@link linkIdp}時に deleteされるフラグ
     */
    if (localStorage.getItem("sokontokoro-factory:auth:debug") === "true") {
      doc.debug = true;
    }

    await newDocRef.set(doc);
  }

  /**
   * ID ProviderのCredentialをUser Docに紐づける。
   * 同一のprovide idがlink済みの場合(duplicatedUser!==nullの場合)、credential情報の更新と、duplicatedUserのreferenceをuserに書き込む
   *
   * @param newCredential
   * @param duplicatedUser
   */
  public static async linkIdp(
    newCredential: UserCredential,
    duplicatedUser: FirebaseUser | null = null
  ): Promise<FirebaseUser> {
    const {
      user,
      additionalUserInfo,
      credential,
    } = User.shouldFulfilledCredential(newCredential);

    const { providerId } = credential;
    /**
     * Update target user
     */
    const userRef = User.getDocRef(user.uid);
    const userDoc = (await userRef.get()).data() as UserDocument;

    const provider = userDoc.providers[providerId];
    const isNewCredentialForIdp = !provider;
    const credentialRef = isNewCredentialForIdp
      ? Credential.getColRef().doc()
      : provider.credentialRef;

    const isFirstLinkForUser = Object.keys(userDoc.providers).length === 0;

    if (providerId === "twitter.com") {
      const profile = additionalUserInfo.profile as TwitterUser;

      const batch = firebase.firestore().batch();

      // create batch of creation or updating credential
      const newCredentialDoc: Partial<CredentialDocument> = {
        data: {
          // eslint-disable-next-line
          accessToken: (<any>credential).accessToken,
          // eslint-disable-next-line
          secret: (<any>credential).secret,
        },
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (isNewCredentialForIdp) {
        newCredentialDoc.userRef = userRef;
        newCredentialDoc.providerId = providerId;
        newCredentialDoc.createdAt = firebase.firestore.FieldValue.serverTimestamp();

        batch.set(credentialRef, newCredentialDoc);
      } else {
        batch.update(credentialRef, newCredentialDoc);
      }

      // create batch of updating user
      const newUserDoc: Partial<UserDocument> = {
        isAnonymous: false,
      };

      newUserDoc.providers = {
        ...newUserDoc.providers,
        [providerId]: {
          userId: profile.id_str,
          linkedAt: firebase.firestore.FieldValue.serverTimestamp(),
          credentialRef,
        },
      };

      if (isFirstLinkForUser) {
        newUserDoc.displayName = profile.name;
      }

      if (!userDoc.photoURL) {
        newUserDoc.photoURL = profile.profile_image_url_https;
      }

      if (userDoc.debug) {
        // eslint-disable-next-line
        userDoc.debug = firebase.firestore.FieldValue.delete() as any;
      }

      if (duplicatedUser) {
        newUserDoc.duplicatedRefsByLink = userDoc.duplicatedRefsByLink.concat([
          User.getDocRef(duplicatedUser.uid),
        ]);
      }

      batch.update(userRef, newUserDoc);

      // execute batch
      await batch.commit();

      return user;
    }

    throw new Error(`provided provider; ${providerId}, is not supported.`);
  }

  private static shouldFulfilledCredential(
    userCredential: UserCredential
  ): {
    user: FirebaseUser;
    additionalUserInfo: AdditionalUserInfo;
    credential: AuthCredential;
  } {
    const { user, additionalUserInfo, credential } = userCredential;

    if (!user || !additionalUserInfo || !credential) {
      throw new Error(
        "Provided userCredential has no FirebaseUser, AdditionalUserInfo or AuthCredential."
      );
    }

    return {
      user,
      additionalUserInfo,
      credential,
    };
  }
}
