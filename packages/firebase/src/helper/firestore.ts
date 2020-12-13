import { firestore } from "firebase-admin";

// eslint-disable-next-line import/no-extraneous-dependencies
import { UserDocument } from "@sokontokoro/mikan";

export const userColRef = firestore().collection(
  "users"
) as firestore.CollectionReference<UserDocument>;

export const userDocRef = (
  id: string
): firestore.DocumentReference<UserDocument> => {
  return userColRef.doc(id);
};
