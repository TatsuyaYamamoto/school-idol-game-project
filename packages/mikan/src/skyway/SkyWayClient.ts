import { firestore } from "firebase/app";
import DocumentSnapshot = firestore.DocumentSnapshot;

const Peer = require("skyway-js");
import AutoBind from "autobind-decorator";
import { EventEmitter } from "eventemitter3";

import SkyWayEvents from "./SkyWayEvents";
import Credential from "./Credential";
import Data, { Message } from "./Data";

import {
  User,
  Room,
  RoomDocument,
  RoomName,
  Game,
  callHttpsCallable
} from "..";
import { mean } from "../Calculation";
import { getLogger } from "../logger";
import { getRandomRoomName } from "../model/roomNames";

const logger = getLogger("skyway:client");

export type Peer = any;
export type Connection = any;
export type PeerID = string;

export interface SkyWayClientConstructorParams {
  peerId: PeerID;
  apiKey: string;
  credential: Credential;
}

export type MediaConnection = any;

/**
 * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/dataconnection/
 */
export interface DataConnection {
  readonly metadata: object;
  readonly open: boolean;
  readonly remoteId: string;

  send(data: any): void;
  close(): void;
  on(type: string, callback: (params: any) => void): void;
  removeAllListeners(type?: string): void;
}

export interface Destination {
  dataConnection: DataConnection;
  averagePing: number;
  pingHistory: number[];
}

const PING_COUNT_FOR_AVERAGE = 5;

@AutoBind
class SkyWayClient extends EventEmitter {
  private _peer: Peer;
  private _destinations: Map<PeerID, Destination> = new Map();
  private _currentRoomDoc: RoomDocument | null = null;

  /**
   * Constructor
   *
   * @param params
   */
  protected constructor(params: SkyWayClientConstructorParams) {
    super();

    const peerOptions = {
      key: params.apiKey,
      debug: 2,
      credential: params.credential,
      logFunction: (args: any) => logger.debug(args)
    };

    this._peer = new Peer(params.peerId, peerOptions);
    this._peer.on("open", this.onPeerOpened);
    this._peer.on("call", this.onPeerCalled);
    this._peer.on("close", this.onPeerClosed);
    this._peer.on("connection", this.onPeerConnectionReceived);
    this._peer.on("disconnected", this.onPeerDisconnected);
    this._peer.on("expiresin", this.onCredentialExpiresIn);
    this._peer.on("error", this.onPeerError);
  }

  /*****************************************************************************
   * Members
   */

  /**
   * The Peer ID specified by a user or randomly assigned Peer ID by the signaling server.
   */
  public get peerId(): string | null {
    return this._peer.id;
  }

  /**
   * Whether the socket is connecting to the signalling server or not.
   */
  public get isPeerOpen(): boolean {
    return this._peer.open;
  }

  /**
   * return joining room name. if not joining return null.
   */
  public get roomName(): string | null {
    return this._currentRoomDoc ? this._currentRoomDoc.name : null;
  }

  /*****************************************************************************
   * Methods
   */

  public static async createClient(apiKey: string): Promise<SkyWayClient> {
    const ownUserId = User.getOwnRef().id;
    const result = await callHttpsCallable("p2pCredential", {
      peerId: ownUserId
    });

    if (!result.data) {
      throw new Error("fail getting credential");
    }

    const credential = result.data as Credential;

    return new SkyWayClient({
      apiKey,
      credential,
      peerId: ownUserId
    });
  }

  /**
   * @param game
   * @param maxMemberCount
   */
  public async createRoom(
    game: Game,
    maxMemberCount: number = 2
  ): Promise<RoomDocument> {
    let roomName;
    let suffix = 0;
    do {
      roomName = getRandomRoomName(suffix);
      suffix++;
    } while (await Room.duplicateName(roomName));

    const { doc, ref } = await Room.create(
      User.getOwnRef(),
      roomName,
      game,
      maxMemberCount
    );

    ref.onSnapshot(this.onRoomSnapshotUpdated);

    return doc;
  }

  /**
   *
   * @param roomName
   */
  public async joinRoom(roomName: RoomName): Promise<void> {
    const ownUserId = User.getOwnRef().id;
    const result = await Room.join(roomName, ownUserId);

    if (!result) {
      console.log("fail join");
      return;
    }

    const { doc, ref } = result;

    Object.keys(doc.userIds)
      .filter(id => id !== ownUserId)
      .forEach(id => {
        const dataConnection = this._peer.connect(id);

        this.setDataConnectionEvents(dataConnection);
      });

    ref.onSnapshot(this.onRoomSnapshotUpdated);

    this._currentRoomDoc = doc;
  }

  /**
   *
   */
  public async leaveRoom() {
    if (!this._currentRoomDoc) {
      return;
    }

    // const userId = User.getOwnRef().id;
    // await Room.leave(this._currentRoomDoc.name, userId);

    this._currentRoomDoc = null;

    this._destinations.forEach(({ dataConnection }) => {
      dataConnection.removeAllListeners();
      dataConnection.close();
    });
    this._destinations.clear();
  }

  public async lockRoom() {}

  /**
   * send {@code message}. if peerId is not provided, try broadcast.
   *
   * @param message
   * @param peerId
   */
  public send(message: Message, peerId?: PeerID) {
    if (!peerId) {
      const data: Data = { message, timestamp: Date.now() };

      this._destinations.forEach(({ dataConnection }) => {
        dataConnection.send(data);
      });
      return;
    }

    const destination = this._destinations.get(peerId);

    if (!destination) {
      return;
    }

    const data: Data = { message, timestamp: Date.now() };

    destination.dataConnection.send(data);
  }

  /*****************************************************************************
   * Events
   */
  /**
   * ClientがSkyWayのシグナリングサーバーと接続した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#open
   * @param peerId
   */
  protected onPeerOpened(peerId: PeerID) {
    this.emit(SkyWayEvents.PEER_OPEN, peerId);
  }

  /**
   * メディアチャネルの接続を受信した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#call_1
   * @param mediaConnection
   */
  protected onPeerCalled(mediaConnection: MediaConnection) {
    this.emit(SkyWayEvents.PEER_CALL, mediaConnection);
  }

  /**
   * Peerに対する全ての接続を終了した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#close
   */
  protected onPeerClosed() {
    this.emit(SkyWayEvents.PEER_CLOSE);
  }

  /**
   * DataChannelの接続を受信した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#connection
   * @param dataConnection
   */
  protected onPeerConnectionReceived(dataConnection: DataConnection) {
    this.setDataConnectionEvents(dataConnection);

    this.emit(SkyWayEvents.PEER_CONNECTION, dataConnection);
  }

  /**
   * シグナリングサーバから切断した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#disconnected
   * @param peerId
   */
  protected onPeerDisconnected(peerId: PeerID) {
    const destination = this._destinations.get(peerId);

    if (!destination) {
      return;
    }

    destination.dataConnection.removeAllListeners();
    this._destinations.delete(peerId);

    this.emit(SkyWayEvents.PEER_DISCONNECTED, peerId);
  }

  /**
   * クレデンシャルが失効する前に発火する
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#expiresin
   * @param timeLeft
   */
  protected onCredentialExpiresIn(timeLeft: number) {
    this.emit(SkyWayEvents.CREDENTIAL_EXPIRES_IN, timeLeft);
  }

  /**
   * エラーが発生した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#error
   * @param e
   */
  protected onPeerError(e: Error) {
    this.emit(SkyWayEvents.PEER_ERROR, e);
  }

  /**
   * データチャネルのデータを受信した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/dataconnection/#data
   * @param peerId
   * @param data
   */
  protected onDataReceived(data: Data, peerId: string) {
    if (logger.getLevel() === logger.levels.DEBUG) {
      setTimeout(() => {
        const ping = Date.now() - data.timestamp;

        logger.debug(
          `received message, peerId: ${peerId}, ping: ${ping}ms`,
          data
        );

        const destination = this._destinations.get(peerId);

        if (!destination) {
          return;
        }

        destination.pingHistory.push(ping);
        if (PING_COUNT_FOR_AVERAGE < destination.pingHistory.length) {
          destination.pingHistory.shift();
        }
        destination.averagePing = mean(destination.pingHistory);
      });
    }

    this.emit(SkyWayEvents.DATA, data, peerId);
  }

  /**
   * DataConnectionが切断された
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/dataconnection/#close_1
   * @param peerId
   */
  protected onDataConnectionClosed(peerId: string) {
    this.emit(SkyWayEvents.CONNECTION_CLOSED, peerId);
  }

  /**
   * Room documentが更新された
   *
   * @param snapshot
   */
  protected onRoomSnapshotUpdated(snapshot: DocumentSnapshot) {
    logger.debug("room snapshot changed");

    if (!snapshot.exists) {
      logger.debug("room doc is deleted.");
      this._currentRoomDoc = null;
      return;
    }
    const prev = this._currentRoomDoc;
    const next = snapshot.data() as RoomDocument;

    if (prev) {
      const prevMemberCount = Object.keys(prev.userIds).length;
      const nextMemberCount = Object.keys(next.userIds).length;

      if (
        prevMemberCount !== nextMemberCount &&
        nextMemberCount === next.maxUserCount
      ) {
        this.emit(SkyWayEvents.MEMBER_FULFILLED);
      }
    }

    if (prev && !prev.lock && next.lock) {
      this.emit(SkyWayEvents.MEMBER_LOCK);
    }

    this._currentRoomDoc = next;
  }

  private setDataConnectionEvents(dataConnection: DataConnection) {
    const peerId = dataConnection.remoteId;

    dataConnection.on("data", (data: any) => {
      this.onDataReceived(data, peerId);
    });
    dataConnection.on("close", () => {
      this.onDataConnectionClosed(peerId);
    });

    this._destinations.set(peerId, {
      dataConnection,
      averagePing: 0,
      pingHistory: []
    });

    logger.debug("set new data connection.", dataConnection);
  }
}

export default SkyWayClient;
