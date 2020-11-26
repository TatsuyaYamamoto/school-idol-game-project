import firebase from "firebase/app";

type UserCredential = firebase.auth.UserCredential;

import { firebaseAuth } from "./index";

import { getLogger } from "../logger";
import { User, UserDocument } from "./User";

const logger = getLogger("mikan/firebase/auth");
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
let isInitRequested = false;

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.auth.Auth#getRedirectResult
 */
interface AuthCredentialAlreadyInUseError extends firebase.auth.Error {
  email: string;
  credential: firebase.auth.AuthCredential;
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

  return new Promise(resolve => {
    /**
     * First state change event will fire after getting redirect result; {@link auth#getRedirectResult}.
     */
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      async authUser => {
        if (authUser) {
          /**
           * Received firebase auth user data.
           * success to signed-in, and resolved init promise.
           */
          logger.debug("signed-in.", authUser.uid);

          let snapshot = await User.getDocRef(authUser.uid).get();

          if (!snapshot.exists) {
            logger.debug("new user. try create a user doc");
            await User.create(authUser);
            snapshot = await User.getDocRef(authUser.uid).get();
            logger.debug("success to create");
          }

          unsubscribe();
          resolve(snapshot.data() as UserDocument);

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
      e => {
        logger.error(e);
      },
      () => {
        logger.debug("auth state change observer is unsubscribed.");
      }
    );

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
          const idp = credential.providerId;
          logger.debug(
            `received redirect result and success to link with IdP; ${idp}`
          );

          unsubscribe();

          const firebaseUser = await User.linkIdp(userCredential);
          logger.debug("success update linked firebase user.");

          const snapshot = await User.getDocRef(firebaseUser.uid).get();
          resolve(snapshot.data() as UserDocument);
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
          const newerAnonymousUser = firebaseAuth.currentUser;

          if (!newerAnonymousUser) {
            throw new Error(
              "unexpected error. could not get newer anonymous user."
            );
          }

          unsubscribe();

          /**
           * Sign-in as a firebase user to be linked with twitter ID.
           */
          const newCredential = await firebaseAuth.signInAndRetrieveDataWithCredential(
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

          const snapshot = await User.getDocRef(reLinkedUser.uid).get();
          resolve(snapshot.data() as UserDocument);
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
export function getIdToken(forceRefresh: boolean = true): Promise<string> {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.getIdToken(forceRefresh);
}

/**
 * Return UID
 */
export function getUid(): string {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("No firebase authed user.");
  }

  return user.uid;
}

/**
 * Sign in to firebase auth as anonymous user.
 *
 * @return Promise<auth.UserCredential>
 */
export function signInAsAnonymous(): Promise<firebase.auth.UserCredential> {
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
