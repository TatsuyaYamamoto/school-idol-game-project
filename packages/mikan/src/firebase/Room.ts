import { firestore } from "firebase/app";

import { firebaseDb } from "./index";
import { Game } from "../model/games";
import MikanError, { ErrorCode } from "../MikanError";
import DocumentReference = firestore.DocumentReference;
import FieldValue = firestore.FieldValue;

const ROOM_LIFETIEM = 1; // 1day

export type RoomName = string;

export interface RoomDocument /* extends firestore.DocumentData */ {
  name: RoomName;
  /**
   * @see https://firebase.google.com/docs/firestore/solutions/arrays?hl=ja#solution_a_map_of_values
   */
  userIds: {
    [userId: string]: boolean;
  };
  game: Game;
  maxUserCount: number;
  lock: boolean;
  createdBy: DocumentReference;
  createdAt: FieldValue | Date;
  expiredAt: FieldValue | Date;
}

export class Room implements RoomDocument {
  public constructor(
    readonly name: RoomName,
    readonly userIds: {
      [userId: string]: boolean;
    },
    readonly game: Game,
    readonly maxUserCount: number,
    readonly lock: boolean,
    readonly createdBy: DocumentReference,
    readonly createdAt: FieldValue | Date,
    readonly expiredAt: FieldValue | Date
  ) {}

  /****************************************************************
   * members
   */
  public get memberIds(): string[] {
    return Object.keys(this.userIds);
  }

  public get memberCount(): number {
    return this.memberIds.length;
  }

  public get isMemberFulfilled(): boolean {
    return this.memberCount === this.maxUserCount;
  }

  /****************************************************************
   * methods
   */
  public static fromData(snapshotData: RoomDocument): Room {
    return new Room(
      snapshotData.name,
      snapshotData.userIds,
      snapshotData.game,
      snapshotData.maxUserCount,
      snapshotData.lock,
      snapshotData.createdBy,
      snapshotData.createdAt,
      snapshotData.expiredAt
    );
  }

  public static getColRef() {
    return firebaseDb.collection("rooms");
  }

  public static getDocRef(id: string) {
    return Room.getColRef().doc(id);
  }

  public static async duplicateName(roomName: string): Promise<boolean> {
    const snapshot = await Room.getColRef()
      .where("name", "==", roomName)
      .get();

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

    const newRoomDoc: RoomDocument = {
      name,
      userIds: {
        [createUserRef.id]: true
      },
      game,
      maxUserCount,
      lock: false,
      createdBy: createUserRef,
      createdAt: firestore.FieldValue.serverTimestamp(),
      expiredAt: firestore.Timestamp.fromDate(expiredDate)
    };

    const newRoomRef = Room.getColRef().doc();

    await newRoomRef.set(newRoomDoc);

    return {
      doc: newRoomDoc,
      ref: newRoomRef
    };
  }

  public static async join(
    roomName: RoomName,
    joinUserId: string
  ): Promise<{ doc: RoomDocument; ref: DocumentReference } | null> {
    const snapshot = await Room.getColRef()
      .where("name", "==", roomName)
      .get();

    if (snapshot.empty) {
      throw new MikanError(
        ErrorCode.FIREBASE_NO_ROOM,
        `provided room; ${roomName}, doesn't exist`
      );
    }

    const roomRef = snapshot.docs[0].ref;

    const updatedRoomDoc = await firestore().runTransaction(
      async transaction => {
        const roomSnapshot = await transaction.get(roomRef);

        if (!roomSnapshot.exists) {
          return null;
        }

        const roomDoc = roomSnapshot.data() as RoomDocument;

        if (roomDoc.maxUserCount <= Object.keys(roomDoc.userIds).length) {
          throw new MikanError(
            ErrorCode.FIREBASE_ROOM_CAPACITY_OVER,
            "provided room is already fulfilled."
          );
        }

        const newRoomDoc: Partial<RoomDocument> = {
          userIds: {
            ...roomDoc.userIds,
            [joinUserId]: true
          }
        };

        transaction.update(roomRef, newRoomDoc);

        return roomDoc;
      }
    );

    if (updatedRoomDoc) {
      return {
        doc: updatedRoomDoc,
        ref: roomRef
      };
    } else {
      return null;
    }
  }

  public async leave(leaveUserId: string) {
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

    await firestore().runTransaction(async transaction => {
      const roomSnapshot = await transaction.get(roomRef);

      if (!roomSnapshot.exists) {
        return;
      }

      const roomDoc = roomSnapshot.data() as RoomDocument;

      const leftMembers = {
        ...roomDoc.userIds
      };

      delete leftMembers[leaveUserId];

      const newRoomDoc: Partial<RoomDocument> = {
        userIds: leftMembers
      };

      transaction.update(roomRef, newRoomDoc);

      return roomDoc;
    });
  }
}