import { firestore } from "firebase-admin";

// eslint-disable-next-line import/no-extraneous-dependencies
import { UserDocument, CredentialDocument } from "@sokontokoro/mikan";

export type UserDoc = UserDocument<firestore.DocumentReference>;
export type CredentialDoc = CredentialDocument<firestore.DocumentReference>;

export const userColRef = firestore().collection(
  "users"
) as firestore.CollectionReference<UserDoc>;

export const userDocRef = (
  id: string
): firestore.DocumentReference<UserDoc> => {
  return userColRef.doc(id);
};

export const credentialColRef = firestore().collection(
  "credentials"
) as firestore.CollectionReference<CredentialDoc>;
