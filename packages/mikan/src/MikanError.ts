export enum ErrorCode {
  FIREBASE_NO_ROOM = "firebase/no-room",
  FIREBASE_ROOM_CAPACITY_OVER = "firebase/room-capacity-over",
  FIREBASE_NO_PRESENCE = "firebase/no-presence",

  SKYWAY_TIMEOUT = "skyway/time-out",
  SKYWAY_FAIL_DATA_CONNECT = "skyway/fail-data-connect",
  SKYWAY_ALREADY_ROOM_MEMBER = "skyway/already-room-member",

  NTP_NOT_SYNCHRONIZED = "ntp/not-synchronized",
}

export default class MikanError extends Error {
  readonly code: ErrorCode;

  public constructor(code: ErrorCode, message?: string) {
    super(message);

    this.code = code;
  }

  public toJSON = (): { code: ErrorCode; message: string } => ({
    code: this.code,
    message: this.message,
  });
}
