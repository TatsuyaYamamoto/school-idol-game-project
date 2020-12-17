import firebase from "firebase/app";
import { Twitter } from "twit";

import { FirebaseClient } from "./FirebaseClient";

type FirebaseUser = firebase.User;
type FieldValue = firebase.firestore.FieldValue;
type UserCredential = firebase.auth.UserCredential;
type DocumentReference = firebase.firestore.DocumentReference;
type AdditionalUserInfo = firebase.auth.AdditionalUserInfo;
type AuthCredential = firebase.auth.AuthCredential;

export interface ProviderData<DocRef = DocumentReference> {
  /**
   * User ID in IdP
   */
  userId: string;
  /**
   * Credential reference as IdP's user.
   *
   * @link CredentialDocument
   */
  credentialRef: DocRef;

  /**
   * Time that the user is lined to IdP's account.
   */
  linkedAt: FieldValue | Date;
}

export interface UserDocument<
  DocRef = DocumentReference
> /* extends firestore.DocumentData */ {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
  photoURL: string | null;
  highscoreRefs: {
    [game: string]: DocRef;
  };

  /**
   * Additional provider-specific information.
   * Add item after {@link auth#linkWithRedirect}.
   * @link ProviderId
   */
  providers: {
    [providerId: string]: ProviderData<DocRef>;
  };
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
  duplicatedRefsByLink: DocRef[];
  presenceRefs: {
    [presenceId: string]: DocRef;
  };
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

  public static async create(user: FirebaseUser): Promise<UserDocument> {
    const res = await FirebaseClient.post({
      path: `/api/users/new`,
      body: {
        uid: user.uid,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(json));
    }

    return json;
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
  ): Promise<UserDocument> {
    const {
      user,
      additionalUserInfo,
      credential,
    } = User.shouldFulfilledCredential(newCredential);

    const { uid } = user;
    const { providerId } = credential;
    const duplicatedUid = duplicatedUser?.uid;

    if (providerId === "twitter.com") {
      const profile = additionalUserInfo.profile as Twitter.User;
      const { accessToken, secret } = <any>credential;
      const res = await FirebaseClient.post({
        path: `/api/users/${uid}/link`,
        body: {
          duplicatedUid,
          provider: {
            id: "twitter.com",
            userId: profile.id_str,
            displayName: profile.name,
            photoUrl: profile.profile_image_url_https,
            accessToken,
            secret,
          },
        },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(JSON.stringify(json));
      }
      return json;
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
