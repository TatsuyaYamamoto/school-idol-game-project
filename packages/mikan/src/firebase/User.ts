import { User as FirebaseUser, firestore } from "firebase/app";

import UserCredential = firebase.auth.UserCredential;
import DocumentReference = firestore.DocumentReference;
import AdditionalUserInfo = firebase.auth.AdditionalUserInfo;
import AuthCredential = firebase.auth.AuthCredential;

import { Twitter } from "twit";
import TwitterUser = Twitter.User;

import { firebaseAuth, firebaseDb } from "./index";
import { Credential, CredentialDocument } from "./Credential";

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
  credentialRef: firebase.firestore.DocumentReference;

  /**
   * Time that the user is lined to IdP's account.
   */
  linkedAt: firebase.firestore.FieldValue | Date;
}

export interface UserDocument /* extends firestore.DocumentData */ {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
  photoURL: string | null;
  highscoreRefs: {
    [game: string]: firebase.firestore.DocumentReference;
  };

  /**
   * Additional provider-specific information.
   * Add item after {@link auth#linkWithRedirect}.
   * @link ProviderId
   */
  providers: {
    [providerId: string]: ProviderData;
  };
  createdAt: firebase.firestore.FieldValue | Date;
  updatedAt: firebase.firestore.FieldValue | Date;
  duplicatedRefsByLink: firebase.firestore.DocumentReference[];
}

export class User {
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

  public static async create(user: FirebaseUser): Promise<void> {
    const newDocRef = User.getColRef().doc(user.uid);

    await newDocRef.set({
      uid: user.uid,
      isAnonymous: true,
      displayName: getRandomAnonymousName(),
      highscoreRefs: {},
      providers: {},
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      duplicatedRefsByLink: []
    });
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
      credential
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

      const batch = firestore().batch();

      // create batch of creation or updating credential
      const newCredentialDoc: Partial<CredentialDocument> = {
        data: {
          accessToken: (<any>credential).accessToken,
          secret: (<any>credential).secret
        },
        updatedAt: firestore.FieldValue.serverTimestamp()
      };

      if (isNewCredentialForIdp) {
        newCredentialDoc.userRef = userRef;
        newCredentialDoc.providerId = providerId;
        newCredentialDoc.createdAt = firestore.FieldValue.serverTimestamp();

        batch.set(credentialRef, newCredentialDoc);
      } else {
        batch.update(credentialRef, newCredentialDoc);
      }

      // create batch of updating user
      const newUserDoc: Partial<UserDocument> = {
        isAnonymous: false
      };

      newUserDoc.providers = {
        ...newUserDoc.providers,
        [providerId]: {
          userId: profile.id_str,
          linkedAt: firestore.FieldValue.serverTimestamp(),
          credentialRef
        }
      };

      if (isFirstLinkForUser) {
        newUserDoc.displayName = profile.name;
      }

      if (!userDoc.photoURL) {
        newUserDoc.photoURL = profile.profile_image_url_https;
      }

      if (duplicatedUser) {
        newUserDoc.duplicatedRefsByLink = userDoc.duplicatedRefsByLink.concat([
          User.getDocRef(duplicatedUser.uid)
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
      credential
    };
  }
}

function getRandomAnonymousName() {
  const candidates = [
    "パン好きな", // honoka
    "かしこかわいい", // eri
    "枕を忘れた", // kotori
    "アイドルは無しな", // umi
    "ラーメン好きな", // rin
    "ﾅﾆｿﾚｲﾐﾜｶﾝﾅｲ", // maki
    "カードが告げる", // nozomi
    "ご飯を炊いた", // hanayo
    "バックダンサーな", // nico
    "アホ毛の", // chika
    "お断りする", // riko
    "ハグをせまる", // kanan
    "プリンを食べる", // dia
    "制服を着た", // you
    "悪いのは", // yoshiko
    "未来の", // hanamaru
    "2年振りに輝く", // mari
    "お芋好きな" // ruby
  ];

  const min = 0;
  const max = candidates.length - 1;
  const index = Math.floor(Math.random() * (max + 1 - min)) + min;

  const prefix = candidates[index];

  return `${prefix}学園生`;
}
