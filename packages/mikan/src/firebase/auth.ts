import { auth, initializeApp, firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { Twitter } from "twit";
import TwitterUser = Twitter.User;
import UserCredential = auth.UserCredential;

import { getLogger } from "../logger";
import User from "./User";
import { mergeUsers, UserDocument } from "./db";
import { userDocRef } from "./utils";

const logger = getLogger("mikan/firebase/auth");
const twitterAuthProvider = new auth.TwitterAuthProvider();

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.auth.Auth#getRedirectResult
 */
interface AuthCredentialAlreadyInUseError extends auth.Error {
  email: string;
  credential: auth.AuthCredential;
}

/**
 * Initialize auth module.
 * A promise of return value will be resolved when signing-in.
 *
 * @param options
 * @param forceRefresh
 */
export function init(options: any): Promise<User> {
  initializeApp(options);
  firestore().settings({ timestampsInSnapshots: true });

  let ignoreChangeStateUid: string = null;

  return new Promise((resolve, reject) => {
    /**
     * First state change event will fire after getting redirect result; {@link auth#getRedirectResult}.
     */
    auth().onAuthStateChanged(user => {
      /**
       * If {@code ignoreChangeStateUid} is set value, ignore this state change.
       * In many cases to set, redirect result error.
       */
      if (user && user.uid === ignoreChangeStateUid) {
        logger.debug(
          `received changing auth state event to be ignored. uid: ${user.uid}`
        );
        return;
      }

      if (user) {
        /**
         * Received firebase auth user data.
         * success to signed-in, and resolved init promise.
         */
        logger.debug("signed-in.", user);
        resolve(User.from(user));
      } else {
        /**
         * received NO firebase auth user data.
         * This state occurs in cases such as "first access" or "signed-out by user".
         * auth module disallows not to be signed-in, then requests to sign-in anonymously.
         */
        logger.debug("signed-out. try signing-in anonymously");
        signInAsAnonymous();
      }
    });

    auth()
      .getRedirectResult()
      .then(async (userCredential: UserCredential) => {
        const {
          operationType,
          user,
          additionalUserInfo,
          credential
        } = userCredential;

        // Received NO redirect result.
        if (!operationType) {
          logger.debug("no redirect result is received.");
          return;
        }

        /**
         * Success operation of link with IdP.
         * Anonymous direbase user is linked twitter user information.
         * After this, {@link auth#onAuthStateChanged}'s callback is fired.
         */
        if (
          operationType === "link" &&
          credential.signInMethod === "twitter.com"
        ) {
          logger.debug(
            "received redirect result and success to link with IdP."
          );

          const profile = additionalUserInfo.profile as TwitterUser;
          const userRef = userDocRef(user.uid);

          await firestore().runTransaction(async transaction => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
              throw "Document does not exist!";
            }

            const providerData = userDoc.data().providerData || [];
            providerData.push({
              uid: profile.id_str,
              providerId: credential.signInMethod,
              linkedAt: new Date()
            });

            transaction.update(userRef, { providerData });
          });

          logger.debug("success update linked firebase user.");

          return;
        }

        throw new Error(`unexpected redirect result is received.`);
      })
      .catch(async (error: auth.Error) => {
        if (error.code === "auth/credential-already-in-use") {
          logger.debug("received credential is already in use.", error);

          /**
           * User accepted to link between anonymous firebase user and twitter ID.
           * But accepted twitter ID is already linked with another firebase auth user.
           */
          const e = error as AuthCredentialAlreadyInUseError;
          const newerAnonymousUser = getCurrentUser();

          /**
           * while processing {@link auth#signInAndRetrieveDataWithCredential},
           * {@link auth#onAuthStateChanged}'s callback is fired and provides anonymous user to be tried linking.
           * {@code ignoreChangeStateUid} prevents to continue {@link auth#onAuthStateChanged}'s process.
           */
          ignoreChangeStateUid = newerAnonymousUser.uid;

          /**
           * Sign-in as a firebase user to be linked with twitter ID.
           */
          const userCredential: auth.UserCredential = await auth().signInAndRetrieveDataWithCredential(
            e.credential
          );

          /**
           * Release ignoring flag.
           */
          ignoreChangeStateUid = null;

          const olderLinkedUser = userCredential.user;

          await mergeUsers();
        } else {
          // Unexpected error occurred.
          throw error;
        }
      });
  });
}

export function getCurrentUser(): User {
  const currentFirebaseUser = auth().currentUser;

  if (!currentFirebaseUser) {
    throw new Error("no current user received.");
  }

  return User.from(currentFirebaseUser);
}

export function getIdToken(forceRefresh: boolean = true): Promise<string> {
  return auth().currentUser.getIdToken(forceRefresh);
}

export function signInAsAnonymous(): Promise<auth.UserCredential> {
  return auth().signInAnonymously();
}

export function signInAsTwitterUser(): Promise<void> {
  return auth().currentUser.linkWithRedirect(twitterAuthProvider);
}

export function signOut(): Promise<void> {
  return auth().signOut();
}
