import { auth } from "firebase/app";

import UserCredential = auth.UserCredential;

import { firebaseAuth } from "./index";

import { getLogger } from "../logger";
import { User } from "./User";

const logger = getLogger("mikan/firebase/auth");
const twitterAuthProvider = new auth.TwitterAuthProvider();
let isInitRequested = false;

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
 */
export function init(): Promise<User> {
  /**
   * 2回実行する必要がない and テストをしない。
   */
  if (isInitRequested) {
    throw new Error("auth module initialization can execute just one time.");
  }

  isInitRequested = true;

  /**
   * UID to be ignored {@link auth#onAuthStateChanged} event.
   * firebase auth moduleのsignやlinkの実装上、期待しないUIDのイベントも実行される。
   */
  let ignoreChangeStateUid: string | null = null;

  return new Promise((resolve, reject) => {
    /**
     * First state change event will fire after getting redirect result; {@link auth#getRedirectResult}.
     */
    firebaseAuth.onAuthStateChanged(user => {
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
        logger.debug("signed-in.", user.uid);
        resolve(User.from(user));
        return;
      }

      /**
       * received NO firebase auth user data.
       * This state occurs in cases such as "first access" or "signed-out by user".
       * mikan auth module disallows not to be signed-in, then requests to sign-in anonymously.
       */
      logger.debug("signed-out. try signing-in anonymously");
      signInAsAnonymous();
    });

    firebaseAuth
      .getRedirectResult()
      .then(async (userCredential: UserCredential) => {
        const { operationType, credential } = userCredential;

        // Received NO redirect result.
        if (!operationType) {
          logger.debug("no redirect result is received.");
          return;
        }

        /**
         * Success operation of link with IdP.
         * Anonymous firebase user is linked twitter user information.
         * After this, {@link auth#onAuthStateChanged}'s callback is fired.
         */
        if (operationType === "link" && credential) {
          const idp = credential.signInMethod;
          logger.debug(
            `received redirect result and success to link with IdP; ${idp}`
          );

          await User.linkIdp(userCredential);

          logger.debug("success update linked firebase user.");

          return;
        }

        reject(`unexpected redirect result is received.`);
      })
      .catch(async (error: auth.Error) => {
        if (error.code === "auth/credential-already-in-use") {
          /**
           * User accepted to link between anonymous firebase user and twitter ID.
           * But accepted twitter ID is already linked with another firebase auth user.
           */
          logger.debug("received credential is already in use.", error);

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
          const alreadyLinkedFirebaseUser = (await firebaseAuth.signInAndRetrieveDataWithCredential(
            e.credential
          )).user;

          if (!alreadyLinkedFirebaseUser) {
            reject(
              "unexpected error. could not get user in already-in-use event."
            );
            return;
          }

          await User.from(alreadyLinkedFirebaseUser).addDuplicatedRef(
            newerAnonymousUser
          );

          /**
           * Release ignoring flag.
           */
          ignoreChangeStateUid = null;
        } else {
          // Unexpected error occurred.
          reject(error);
        }
      });
  });
}

/**
 * Return current {@link User}.
 */
export function getCurrentUser(): User {
  const currentFirebaseUser = firebaseAuth.currentUser;

  if (!currentFirebaseUser) {
    throw new Error("no current user received.");
  }

  return User.from(currentFirebaseUser);
}

/**
 * Return Firebase ID Token.
 *
 * @param forceRefresh if false, try get from local storage.
 * @return Promise<string>
 */
export function getIdToken(forceRefresh: boolean = true): Promise<string> {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.getIdToken(forceRefresh);
}

/**
 * Sign in to firebase auth as anonymous user.
 *
 * @return Promise<auth.UserCredential>
 */
export function signInAsAnonymous(): Promise<auth.UserCredential> {
  return firebaseAuth.signInAnonymously();
}

/**
 * Sign in firebase auth as Twitter User.
 *
 * @return Promise<void>
 */
export function signInAsTwitterUser(): Promise<void> {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.linkWithRedirect(twitterAuthProvider);
}

/**
 * Sing out
 */
export function signOut(): Promise<void> {
  return firebaseAuth.signOut();
}
