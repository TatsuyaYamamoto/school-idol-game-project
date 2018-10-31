export default class MikanError extends Error {
  readonly code: ErrorCode;
  public constructor(code: ErrorCode, message: string) {
    super(message);

    this.code = code;
  }

  public toJSON = () => ({
    code: this.code,
    message: this.message
  });
}

export enum ErrorCode {
  FIREBASE_NO_ROOM = "firebase/no-room"
}
