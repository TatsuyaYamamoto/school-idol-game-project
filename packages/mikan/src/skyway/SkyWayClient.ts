import { firestore, Unsubscribe } from "firebase/app";
import DocumentSnapshot = firestore.DocumentSnapshot;

import AutoBind from "autobind-decorator";
import { EventEmitter } from "eventemitter3";

import SkyWayEvents from "./SkyWayEvents";
import Credential from "./Credential";
import Data, { Message } from "./Data";

import {
  callHttpsCallable,
  Room,
  RoomDocument,
  RoomName,
  User,
  Game
} from "..";
import { mean } from "../Calculation";
import { getLogger } from "../logger";
import { getRandomRoomName } from "../model/roomNames";

const Peer = require("skyway-js");

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
  private _currentRoom: Room | null = null;
  private _unsubscribeRoomSnapshot: Unsubscribe | null = null;

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
    this._peer.on("connection", this.onDataConnectionReceived);
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

  public get remotePeerIds(): string[] {
    return Array.from(this._destinations.values()).map(
      d => d.dataConnection.remoteId
    );
  }

  public get averagePings(): number[] {
    return Array.from(this._destinations.values()).map(d => d.averagePing);
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
    return this._currentRoom ? this._currentRoom.name : null;
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

    this._unsubscribeRoomSnapshot = ref.onSnapshot(this.onRoomSnapshotUpdated);
    this._currentRoom = Room.fromData(doc);

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

    this._unsubscribeRoomSnapshot = ref.onSnapshot(this.onRoomSnapshotUpdated);
    this._currentRoom = Room.fromData(doc);

    for (const remoteId of this._currentRoom.memberIds.filter(
      id => id !== ownUserId
    )) {
      const dataConnection = this._peer.connect(remoteId);
      dataConnection.on("open", () => {
        this.onDataConnectionOpened(dataConnection);
      });
    }
  }

  /**
   *
   */
  public async leaveRoom() {
    if (!this._currentRoom) {
      return;
    }
    if (this._unsubscribeRoomSnapshot) {
      this._unsubscribeRoomSnapshot();
    }

    const userId = User.getOwnRef().id;
    await this._currentRoom.leave(userId);

    this._currentRoom = null;
    this._unsubscribeRoomSnapshot = null;

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
    logger.debug("peer opened. ID: " + peerId);

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
   * DataChannelのインスタンスを受信した。
   *
   * この時点では接続が確立されていないことに注意。
   * {@code DataConnection}のopenイベントをlistenし、確立後に{@code onDataConnectionOpened}を実行する。
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#connection
   * @see SkyWayClient#onDataConnectionOpened
   * @param dataConnection
   */
  protected onDataConnectionReceived(dataConnection: DataConnection) {
    logger.debug(
      "received new data connection instance.",
      dataConnection.remoteId
    );

    dataConnection.on("open", () => {
      this.onDataConnectionOpened(dataConnection);
    });

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
   * DataChannelの接続が確立された。({@link DataConnection#open} === trueになった)
   *
   * @param dataConnection
   */
  protected onDataConnectionOpened(dataConnection: DataConnection) {
    const peerId = dataConnection.remoteId;
    logger.debug("data connection is opened.", peerId);

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

    this.emit(SkyWayEvents.CONNECTION_OPENED, peerId);
  }

  /**
   * データチャネルからデータを受信した
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
   * Note: 相手の切断(reloadとか)から発火まで、15秒以上かかる => Clientへの通知には使えない
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/dataconnection/#close_1
   * @param peerId
   */
  protected onDataConnectionClosed(peerId: string) {
    logger.debug("data connection closed", peerId);

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
      return;
    }
    const prev = this._currentRoom;
    const next = Room.fromData(snapshot.data() as any);

    if (prev) {
      const prevMemberCount = prev.memberCount;
      const nextMemberCount = next.memberCount;

      if (prevMemberCount !== nextMemberCount && next.isMemberFulfilled) {
        this.emit(SkyWayEvents.MEMBER_FULFILLED);

        this.startLoopConnectionCheck(next.memberCount - 1);
      }
    }

    if (prev && !prev.lock && next.lock) {
      this.emit(SkyWayEvents.MEMBER_LOCK);
    }

    if (prev) {
      const prevMemberCount = prev.memberCount;
      const nextMemberCount = next.memberCount;

      if (nextMemberCount < prevMemberCount) {
        const leftUserId = prev.memberIds.find(prevId => {
          return !next.memberIds.find(nextId => nextId === prevId);
        });

        this.emit(SkyWayEvents.MEMBER_LEFT, leftUserId);
      }
    }

    this._currentRoom = next;
  }

  private startLoopConnectionCheck(shouldReadyMemberCount: number) {
    logger.debug("check all members are ready.");

    const readyCount = Array.from(this._destinations.values()).filter(dest => {
      return dest.dataConnection.open === true;
    }).length;

    if (readyCount === shouldReadyMemberCount) {
      logger.debug("all ready.");

      this.emit(SkyWayEvents.READY);
    } else {
      logger.debug("not ready. try again 500ms after.");
      setTimeout(
        () => this.startLoopConnectionCheck(shouldReadyMemberCount),
        3000
      );
    }
  }
}

export default SkyWayClient;
