import firebase from "firebase/app";

import { FirebaseClient } from "./FirebaseClient";
import { Presence } from "./Presence";
import { Game } from "..";
import MikanError, { ErrorCode } from "../MikanError";

type DocumentReference = firebase.firestore.DocumentReference;
type FieldValue = firebase.firestore.FieldValue;

const ROOM_LIFETIEM = 1; // 1day

export type RoomName = string;

export interface RoomDocument /* extends firestore.DocumentData */ {
  name: RoomName;
  /**
   * @see https://firebase.google.com/docs/firestore/solutions/arrays?hl=ja#solution_a_map_of_values
   */
  userPresenceRefs: {
    [userId: string]: DocumentReference;
  };
  game: Game;
  maxUserCount: number;
  lock: boolean;
  createdBy: DocumentReference;
  createdAt: FieldValue | Date;
  expiredAt: FieldValue | Date;
}

export class Room implements RoomDocument {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly name: RoomName,
    readonly userPresenceRefs: {
      [userId: string]: DocumentReference;
    },
    readonly game: Game,
    readonly maxUserCount: number,
    readonly lock: boolean,
    readonly createdBy: DocumentReference,
    readonly createdAt: FieldValue | Date,
    readonly expiredAt: FieldValue | Date
  ) {}

  /** **************************************************************
   * members
   */
  public get memberIds(): string[] {
    return Object.keys(this.userPresenceRefs);
  }

  public get memberCount(): number {
    return this.memberIds.length;
  }

  public get isMemberFulfilled(): boolean {
    return this.memberCount === this.maxUserCount;
  }

  /** **************************************************************
   * methods
   */
  public static fromData(snapshotData: RoomDocument): Room {
    return new Room(
      snapshotData.name,
      snapshotData.userPresenceRefs,
      snapshotData.game,
      snapshotData.maxUserCount,
      snapshotData.lock,
      snapshotData.createdBy,
      snapshotData.createdAt,
      snapshotData.expiredAt
    );
  }

  public static getColRef(): firebase.firestore.CollectionReference {
    return FirebaseClient.firestore.collection("rooms");
  }

  public static getDocRef(id: string): firebase.firestore.DocumentReference {
    return Room.getColRef().doc(id);
  }

  public static async duplicateName(roomName: string): Promise<boolean> {
    const snapshot = await Room.getColRef().where("name", "==", roomName).get();

    return !snapshot.empty;
  }

  public static async create(
    createUserRef: DocumentReference,
    name: string,
    game: Game,
    maxUserCount: number
  ): Promise<{ doc: RoomDocument; ref: DocumentReference }> {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + ROOM_LIFETIEM);
    const presenceRef = Presence.getDocRef(Presence.id);

    const newRoomDoc: RoomDocument = {
      name,
      userPresenceRefs: {
        [createUserRef.id]: presenceRef,
      },
      game,
      maxUserCount,
      lock: false,
      createdBy: createUserRef,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      expiredAt: firebase.firestore.Timestamp.fromDate(expiredDate),
    };

    const newRoomRef = Room.getColRef().doc();

    await newRoomRef.set(newRoomDoc);

    return {
      doc: newRoomDoc,
      ref: newRoomRef,
    };
  }

  public static async join(
    roomName: RoomName,
    joinUserId: string
  ): Promise<{ doc: RoomDocument; ref: DocumentReference } | null> {
    const presenceRef = Presence.getDocRef(Presence.id);
    const snapshot = await Room.getColRef().where("name", "==", roomName).get();

    if (snapshot.empty) {
      throw new MikanError(
        ErrorCode.FIREBASE_NO_ROOM,
        `provided room; ${roomName}, doesn't exist`
      );
    }

    const roomRef = snapshot.docs[0].ref;

    const updatedRoomDoc = await firebase
      .firestore()
      .runTransaction(async (transaction) => {
        const roomSnapshot = await transaction.get(roomRef);

        if (!roomSnapshot.exists) {
          return null;
        }

        const roomDoc = roomSnapshot.data() as RoomDocument;

        if (
          roomDoc.maxUserCount <= Object.keys(roomDoc.userPresenceRefs).length
        ) {
          throw new MikanError(
            ErrorCode.FIREBASE_ROOM_CAPACITY_OVER,
            "provided room is already fulfilled."
          );
        }

        const newRoomDoc: Partial<RoomDocument> = {
          userPresenceRefs: {
            ...roomDoc.userPresenceRefs,
            [joinUserId]: presenceRef,
          },
        };

        transaction.update(roomRef, newRoomDoc);

        return roomDoc;
      });

    if (updatedRoomDoc) {
      return {
        doc: updatedRoomDoc,
        ref: roomRef,
      };
    }
    return null;
  }

  public async leave(leaveUserId: string): Promise<void> {
    const snapshot = await Room.getColRef()
      .where("name", "==", this.name)
      .get();

    if (snapshot.empty) {
      throw new MikanError(
        ErrorCode.FIREBASE_NO_ROOM,
        `provided room; ${this.name}, doesn't exist`
      );
    }

    const roomRef = snapshot.docs[0].ref;

    await firebase.firestore().runTransaction(async (transaction) => {
      const roomSnapshot = await transaction.get(roomRef);

      if (!roomSnapshot.exists) {
        return;
      }

      const roomDoc = roomSnapshot.data() as RoomDocument;

      const leftMemberPresenceRefs = {
        ...roomDoc.userPresenceRefs,
      };

      delete leftMemberPresenceRefs[leaveUserId];

      const newRoomDoc: Partial<RoomDocument> = {
        userPresenceRefs: leftMemberPresenceRefs,
      };

      transaction.update(roomRef, newRoomDoc);

      // eslint-disable-next-line
      return roomDoc;
    });
  }
}
