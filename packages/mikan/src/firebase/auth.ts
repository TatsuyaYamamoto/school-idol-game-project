import firebase from "firebase/app";

import { FirebaseClient } from "./FirebaseClient";

import { getLogger } from "../logger";
import { User, UserDocument } from "./User";

type UserCredential = firebase.auth.UserCredential;

const logger = getLogger("mikan/firebase/auth");
let isInitRequested = false;

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.auth.Auth#getRedirectResult
 */
interface AuthCredentialAlreadyInUseError extends firebase.auth.Error {
  email: string;
  credential: firebase.auth.AuthCredential;
}

function throwErrorAsUndefinedRedirectOperation(
  userCredential: UserCredential
) {
  const { operationType, credential, user } = userCredential;

  let message = `unexpected redirect result is received.`;

  if (user) {
    message += ` user id: ${user.uid}`;
  } else {
    message += ` user is null`;
  }

  message += `, operationType: ${operationType}`;

  if (credential) {
    const { providerId, signInMethod } = credential;
    message += `, providerId: ${providerId}, signInMethod: ${signInMethod}`;
  } else {
    message += `, credential is null`;
  }

  throw new Error(message);
}

/**
 * Sign in to firebase auth as anonymous user.
 *
 * @return Promise<auth.UserCredential>
 */
export function signInAsAnonymous(): Promise<firebase.auth.UserCredential> {
  return FirebaseClient.auth.signInAnonymously();
}

/**
 * Initialize auth module.
 * A promise of return value will be resolved when signing-in.
 */
export function init(): Promise<UserDocument> {
  /**
   * 2回実行する必要がない and テストをしない。
   */
  if (isInitRequested) {
    throw new Error("auth module initialization can execute just one time.");
  }

  isInitRequested = true;

  return new Promise((resolve) => {
    /**
     * First state change event will fire after getting redirect result; {@link auth#getRedirectResult}.
     */
    const unsubscribe = FirebaseClient.auth.onAuthStateChanged(
      async (authUser) => {
        if (authUser) {
          /**
           * Received firebase auth user data.
           * success to signed-in, and resolved init promise.
           */
          logger.debug("signed-in.", authUser.uid);

          const snapshot = await User.getDocRef(authUser.uid).get();
          let user: UserDocument;

          if (snapshot.exists) {
            user = snapshot.data() as UserDocument;
          } else {
            logger.debug("user is not in DB.");
            user = await User.create(authUser);
            logger.debug(`created as new user, uid: ${authUser.uid}`);
          }

          unsubscribe();
          resolve(user);

          return;
        }

        /**
         * received NO firebase auth user data.
         * This state occurs in cases such as "first access" or "signed-out by user".
         * mikan auth module disallows not to be signed-in, then requests to sign-in anonymously.
         */
        logger.debug("signed-out. try signing-in anonymously");
        signInAsAnonymous();
      },
      (e) => {
        logger.error(e);
      },
      () => {
        logger.debug("auth state change observer is unsubscribed.");
      }
    );

    FirebaseClient.auth
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
          const idp = credential.providerId;
          logger.debug(
            `received redirect result and success to link with IdP; ${idp}`
          );

          unsubscribe();

          const linkedUser = await User.linkIdp(userCredential);
          logger.debug("success update linked firebase user.");

          resolve(linkedUser);
          return;
        }

        /**
         * Undefined redirect operation
         */
        throwErrorAsUndefinedRedirectOperation(userCredential);
      })
      .catch(async (error: firebase.auth.Error) => {
        if (error.code === "auth/credential-already-in-use") {
          /**
           * User accepted to link between anonymous firebase user and twitter ID.
           * But accepted twitter ID is already linked with another firebase auth user.
           */
          logger.debug("received credential is already in use.", error);

          const e = error as AuthCredentialAlreadyInUseError;
          const newerAnonymousUser = FirebaseClient.auth.currentUser;

          if (!newerAnonymousUser) {
            throw new Error(
              "unexpected error. could not get newer anonymous user."
            );
          }

          unsubscribe();

          /**
           * Sign-in as a firebase user to be linked with twitter ID.
           */
          const newCredential = await FirebaseClient.auth.signInWithCredential(
            e.credential
          );
          const alreadyLinkedFirebaseUser = newCredential.user;

          if (!alreadyLinkedFirebaseUser) {
            throw new Error(
              "unexpected error. could not get user in already-in-use event."
            );
          }

          const reLinkedUser = await User.linkIdp(
            newCredential,
            newerAnonymousUser
          );
          logger.debug("success to re-link firebase user.");

          resolve(reLinkedUser);
          return;
        }

        if (error.code === "auth/user-cancelled") {
          logger.error(error);
          return;
        }

        // Unexpected error occurred.
        throw error;
      });
  });
}

/**
 * Return Firebase ID Token.
 *
 * @param forceRefresh if false, try get from local storage.
 * @return Promise<string>
 */
export function getIdToken(forceRefresh = true): Promise<string> {
  const user = FirebaseClient.auth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.getIdToken(forceRefresh);
}

/**
 * Return UID
 */
export function getUid(): string {
  const user = FirebaseClient.auth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.uid;
}

/**
 * Sign in firebase auth as Twitter User.
 *
 * @return Promise<void>
 */
export function signInAsTwitterUser(): Promise<void> {
  const user = FirebaseClient.auth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.linkWithRedirect(new firebase.auth.TwitterAuthProvider());
}

/**
 * Sing out
 */
export function signOut(): Promise<void> {
  return FirebaseClient.auth.signOut();
}
