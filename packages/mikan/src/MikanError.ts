export default class MikanError extends Error {
  readonly code: ErrorCode;
  public constructor(code: ErrorCode, message?: string) {
    super(message);

    this.code = code;
  }

  public toJSON = () => ({
    code: this.code,
    message: this.message
  });
}

export enum ErrorCode {
  FIREBASE_NO_ROOM = "firebase/no-room",
  FIREBASE_ROOM_CAPACITY_OVER = "firebase/room-capacity-over",

  SKYWAY_TIMEOUT = "skyway/time-out",
  SKYWAY_FAIL_DATA_CONNECT = "skyway/fail-data-connect",
  SKYWAY_ALREADY_ROOM_MEMBER = "skyway/already-room-member"
}
