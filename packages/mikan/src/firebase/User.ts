import {
  User as FirebaseUser,
  UserInfo as FirebaseUserInfo
} from "firebase/app";

class User {
  private constructor(readonly firebaseUser: FirebaseUser) {}

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

export default User;
