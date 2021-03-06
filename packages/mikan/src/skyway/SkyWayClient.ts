import firebase from "firebase/app";

import AutoBind from "autobind-decorator";
import { EventEmitter } from "eventemitter3";

import { RoomEvents, SkyWayEvents } from "./SkyWayEvents";
import Credential from "./Credential";
import Data, { Message } from "./Data";

import {
  ErrorCode,
  Game,
  MikanError,
  Room,
  RoomDocument,
  RoomName,
  User,
  mean,
} from "..";
import { getLogger } from "../logger";
import { getRandomRoomName } from "../model/roomNames";
import NtpDate from "../NtpDate";
import LimitedArray from "../util/LimitedArray";

type Unsubscribe = firebase.Unsubscribe;
type DocumentSnapshot = firebase.firestore.DocumentSnapshot;

// eslint-disable-next-line
const Peer = require("skyway-js");

const logger = getLogger("skyway:client");

// eslint-disable-next-line
export type Peer = any;
// eslint-disable-next-line
export type Connection = any;
export type PeerID = string;

export interface SkyWayClientConstructorParams {
  peerId: PeerID;
  apiKey: string;
  credential: Credential;
}

// eslint-disable-next-line
export type MediaConnection = any;

/**
 * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/dataconnection/
 */
export interface DataConnection {
  readonly metadata: Record<string, unknown>;
  readonly open: boolean;
  readonly remoteId: string;

  // eslint-disable-next-line
  send(data: any): void;
  close(): void;
  // eslint-disable-next-line
  on(type: string, callback: (params: any) => void): void;
  removeAllListeners(type?: string): void;
}

export interface Destination {
  dataConnection: DataConnection;
  averagePing: number;
  pingHistory: LimitedArray<number>;
}

const PING_COUNT_FOR_AVERAGE = 5;

@AutoBind
class SkyWayClient extends EventEmitter {
  private _peer: Peer;

  private _destinations: Map<PeerID, Destination> = new Map();

  private _currentRoom: Room | null = null;

  private _unsubscribeRoomSnapshot: Unsubscribe | null = null;

  private _isRoomOwner = false;

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
      // eslint-disable-next-line
      logFunction: (args: any) => logger.debug(args),
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

  /** ***************************************************************************
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
      (d) => d.dataConnection.remoteId
    );
  }

  public get averagePings(): number[] {
    return Array.from(this._destinations.values()).map((d) => d.averagePing);
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

  public get isRoomOwner(): boolean {
    return this._isRoomOwner;
  }

  /**
   * return joining room
   */
  public get room(): Room | null {
    return this._currentRoom;
  }

  /** ***************************************************************************
   * Methods
   */
  public isListeningTo(eventName: string | SkyWayEvents | RoomEvents): boolean {
    return this.listeners(eventName).length > 0;
  }

  public static async createClient(apiKey: string): Promise<SkyWayClient> {
    await NtpDate.sync();

    const ownUserId = User.getOwnRef().id;
    const result = await firebase.functions().httpsCallable("p2pCredential")({
      peerId: ownUserId,
    });

    if (!result.data) {
      throw new Error("fail getting credential");
    }

    const credential = result.data as Credential;

    return new SkyWayClient({
      apiKey,
      credential,
      peerId: ownUserId,
    });
  }

  /**
   * @param game
   * @param maxMemberCount
   */
  public async createRoom(
    game: Game,
    maxMemberCount = 2
  ): Promise<RoomDocument> {
    if (this.room) {
      throw new MikanError(
        ErrorCode.SKYWAY_ALREADY_ROOM_MEMBER,
        `this client is already ${this.roomName}`
      );
    }

    let roomName;
    let suffix = 0;
    do {
      roomName = getRandomRoomName(suffix);
      suffix += 1;
      // eslint-disable-next-line
    } while (await Room.duplicateName(roomName));

    const { doc, ref } = await Room.create(
      User.getOwnRef(),
      roomName,
      game,
      maxMemberCount
    );

    this._isRoomOwner = true;
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

    // eslint-disable-next-line
    for (const remoteId of this._currentRoom.memberIds.filter(
      (id) => id !== ownUserId
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
  public async leaveRoom(): Promise<void> {
    const userId = User.getOwnRef().id;

    // remove current room.
    if (!this._currentRoom) {
      return;
    }
    await this._currentRoom.leave(userId);
    this._currentRoom = null;

    // unsubscrive room event in firestore
    if (this._unsubscribeRoomSnapshot) {
      this._unsubscribeRoomSnapshot();
    }
    this._unsubscribeRoomSnapshot = null;

    // off all room events.
    this.eventNames().forEach((eventName) => {
      /** @see SkyWayEvents */
      if (eventName.toString().startsWith("room")) {
        this.removeAllListeners(eventName);
      }
    });

    // Clear remote peers.
    this._destinations.forEach(({ dataConnection }) => {
      dataConnection.removeAllListeners();
      dataConnection.close();
    });
    this._destinations.clear();
  }

  public async lockRoom(): Promise<void> {
    // do nothing
  }

  /**
   * send {@code message}. if peerId is not provided, try broadcast.
   *
   * @param message
   * @param peerId
   */
  public send(message: Message, peerId?: PeerID): void {
    if (!peerId) {
      const data: Data = { message, timestamp: NtpDate.now() };

      this._destinations.forEach(({ dataConnection }) => {
        dataConnection.send(data);
      });
      return;
    }

    const destination = this._destinations.get(peerId);

    if (!destination) {
      return;
    }

    const data: Data = { message, timestamp: NtpDate.now() };

    destination.dataConnection.send(data);
  }

  /**
   *
   *
   * @example
   * {@code
   *  const startTime = await client.trySyncStartTime();
   *  const now = NtpDate.now();
   *  const offset = startTime - now;
   *  if (0 < offset) {
   *    setTimeout(startGame, offset);
   *  } else {
   *    startGame();
   *  }
   * }
   *
   */
  public trySyncStartTime(): Promise<number> {
    const OFFSET = 4 * 1000; // [ms]
    const PROPOSAL_LIFETIME = 2 * 1000; // [ms]
    enum MessageType {
      PROPOSAL = "sync-start/proposal",
      ACCEPTANCE = "sync-start/acceptance",
      DECISION = "sync-start/decision",
    }
    const isFirstSignalSender = this.isRoomOwner;
    const acceptanceMap = new Map<string /* peerId */, boolean>();
    const remotePeerCount = this._destinations.size;
    let isResolved = false;
    let currentProposalId = "__dummy__";
    let currentProposalStartTime = Number.MAX_SAFE_INTEGER;
    let currentProposalExpirationTime = Number.MAX_SAFE_INTEGER;

    interface TrySyncData {
      type: MessageType;
      // eslint-disable-next-line
      detail: any;
    }

    return new Promise<number>((resolve) => {
      /**
       *
       */
      const resolveSync = () => {
        isResolved = true;
        const time = new NtpDate(currentProposalStartTime).toString();
        logger.debug(`sync start time is resolved.`, time);

        if (isFirstSignalSender) {
          // eslint-disable-next-line
          this.off(SkyWayEvents.DATA, onFirstSignalSenderDataReceived);
        } else {
          // eslint-disable-next-line
          this.off(SkyWayEvents.DATA, onReceiverDataReceived);
        }

        resolve(currentProposalStartTime);
      };

      /**
       * Proposalがexpireした
       */
      const onExpireProposal = () => {
        if (!isResolved) {
          logger.debug(
            `proposal expired. try to propose again. proposalId: ${currentProposalId}`
          );
          // eslint-disable-next-line
          sendProposal();
        }
      };

      /**
       * Proposalを送信する
       */
      const sendProposal = () => {
        acceptanceMap.clear();
        const now = NtpDate.now();

        currentProposalId = `${now}`;
        currentProposalStartTime = now + OFFSET;
        currentProposalExpirationTime = now + PROPOSAL_LIFETIME;

        const message = {
          type: MessageType.PROPOSAL,
          detail: {
            proposalId: currentProposalId,
            startTime: currentProposalStartTime,
            expiredAt: currentProposalExpirationTime,
          },
        };

        this.send(message);

        setTimeout(onExpireProposal, PROPOSAL_LIFETIME);

        logger.debug(`send sync proposal. proposalId: ${currentProposalId}`);
      };

      /**
       * Acceptanceを送信する
       *
       * @param proposalId
       */
      const sendAcceptance = (proposalId: string) => {
        const message = {
          type: MessageType.ACCEPTANCE,
          detail: {
            proposalId,
          },
        };

        this.send(message);

        logger.debug(`accept sync proposal. proposalId: ${currentProposalId}`);
      };

      /**
       * Proposalを受信した
       *
       * @param proposalId
       * @param startTime
       */
      const onReceiveProposal = (proposalId: string, startTime: number) => {
        currentProposalId = proposalId;
        currentProposalStartTime = startTime;

        logger.debug(
          `received start time proposal for sync start. proposalId: ${currentProposalId}`
        );

        sendAcceptance(proposalId);
      };

      /**
       * Decisionを送信する
       */
      const sendDecision = () => {
        const message = {
          type: MessageType.DECISION,
          detail: {},
        };

        this.send(message);

        logger.debug(
          `send decision of start time of sync proposal. proposalId: ${currentProposalId}`
        );
      };

      /**
       * Acceptanceを受信した
       *
       * @param proposalId
       * @param remotePeerId
       */
      const onReceiveAcceptance = (
        proposalId: string,
        remotePeerId: string
      ) => {
        logger.debug(
          `received start time acceptance from ${remotePeerId}. proposalId: ${proposalId}`
        );

        if (proposalId !== currentProposalId) {
          logger.debug(
            `received acceptance is unmanaged. ignore it. proposalId: ${proposalId}`
          );
          return;
        }

        // aggregate
        acceptanceMap.set(remotePeerId, true);

        // check all members accepted?
        if (acceptanceMap.size === remotePeerCount) {
          const now = NtpDate.now();
          if (now < currentProposalExpirationTime) {
            // decide start time!
            sendDecision();
            resolveSync();
          }
        }
      };

      /**
       * Decisionを受信した
       */
      const onReceiveDecision = () => {
        logger.debug(`received start time decision.`);
        resolveSync();
      };

      /**
       * FirstSignalSenderが{@code Data<TrySyncData>}を受信した。{@code MessageType}に従ってコールバックを振り分ける
       *
       * @param data
       * @param remotePeerId
       */
      const onFirstSignalSenderDataReceived = (
        data: Data<TrySyncData>,
        remotePeerId: PeerID
      ) => {
        if (data.message.type === MessageType.ACCEPTANCE) {
          const { proposalId } = data.message.detail;

          onReceiveAcceptance(proposalId, remotePeerId);
        }
      };

      /**
       * Receiverが{@code Data<TrySyncData>}を受信した。{@code MessageType}に従ってコールバックを振り分ける
       *
       * @param data
       */
      const onReceiverDataReceived = (data: Data<TrySyncData>) => {
        if (data.message.type === MessageType.PROPOSAL) {
          const { proposalId, startTime } = data.message.detail;

          onReceiveProposal(proposalId, startTime);
        }
        if (data.message.type === MessageType.DECISION) {
          onReceiveDecision();
        }
      };

      /**
       * Syncを開始する
       *
       * - FirstSignalSender
       *     - {@code onFirstSignalSenderDataReceived}をlisten開始
       *     - Proposalの送信
       * - Receiver
       *     - {@code onReceiverDataReceived}をlisten開始
       */
      if (isFirstSignalSender) {
        logger.debug(
          "try sync game start. this client's role is first signal sender."
        );
        this.on(SkyWayEvents.DATA, onFirstSignalSenderDataReceived);

        // send first message.
        sendProposal();
      } else {
        logger.debug(
          "try sync game start. this client's role is receiver. wait for first signal."
        );
        this.on(SkyWayEvents.DATA, onReceiverDataReceived);
      }
    });
  }

  /** ***************************************************************************
   * Events
   */
  /**
   * ClientがSkyWayのシグナリングサーバーと接続した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#open
   * @param peerId
   */
  protected onPeerOpened(peerId: PeerID): void {
    logger.debug(`peer opened. ID: ${peerId}`);

    this.emit(SkyWayEvents.PEER_OPEN, peerId);
  }

  /**
   * メディアチャネルの接続を受信した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#call_1
   * @param mediaConnection
   */
  protected onPeerCalled(mediaConnection: MediaConnection): void {
    this.emit(SkyWayEvents.PEER_CALL, mediaConnection);
  }

  /**
   * Peerに対する全ての接続を終了した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#close
   */
  protected onPeerClosed(): void {
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
  protected onDataConnectionReceived(dataConnection: DataConnection): void {
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
  protected onPeerDisconnected(peerId: PeerID): void {
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
  protected onCredentialExpiresIn(timeLeft: number): void {
    this.emit(SkyWayEvents.CREDENTIAL_EXPIRES_IN, timeLeft);
  }

  /**
   * エラーが発生した
   *
   * @see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#error
   * @param e
   */
  protected onPeerError(e: Error): void {
    this.emit(SkyWayEvents.PEER_ERROR, e);
  }

  /**
   * DataChannelの接続が確立された。({@link DataConnection#open} === trueになった)
   *
   * @param dataConnection
   */
  protected onDataConnectionOpened(dataConnection: DataConnection): void {
    const peerId = dataConnection.remoteId;
    logger.debug("data connection is opened.", peerId);

    // eslint-disable-next-line
    dataConnection.on("data", (data: any) => {
      this.onDataReceived(data, peerId);
    });
    dataConnection.on("close", () => {
      this.onDataConnectionClosed(peerId);
    });

    this._destinations.set(peerId, {
      dataConnection,
      averagePing: 0,
      pingHistory: new LimitedArray(PING_COUNT_FOR_AVERAGE),
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
  protected onDataReceived(data: Data, peerId: string): void {
    if (logger.getLevel() === logger.levels.DEBUG) {
      const ping = NtpDate.now() - data.timestamp;

      logger.debug(
        `received message, peerId: ${peerId}, ping: ${ping}ms`,
        data
      );

      const destination = this._destinations.get(peerId);

      if (destination) {
        destination.pingHistory.push(ping);
        destination.averagePing = mean(destination.pingHistory.getAll());
      }
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
  protected onDataConnectionClosed(peerId: string): void {
    logger.debug("data connection closed", peerId);

    this.emit(SkyWayEvents.CONNECTION_CLOSED, peerId);
  }

  /**
   * Room documentが更新された
   *
   * @param snapshot
   */
  protected onRoomSnapshotUpdated(snapshot: DocumentSnapshot): void {
    logger.debug("room snapshot changed");

    if (!snapshot.exists) {
      logger.debug("room doc is deleted.");
      return;
    }
    const prev = this._currentRoom;
    // eslint-disable-next-line
    const next = Room.fromData(snapshot.data() as any);

    if (prev) {
      const prevMemberCount = prev.memberCount;
      const nextMemberCount = next.memberCount;

      if (prevMemberCount !== nextMemberCount && next.isMemberFulfilled) {
        this.emit(RoomEvents.MEMBER_FULFILLED);

        this.startLoopConnectionCheck(next.memberCount - 1);
      }
    }

    if (prev && !prev.lock && next.lock) {
      this.emit(RoomEvents.MEMBER_LOCK);
    }

    if (prev) {
      const prevMemberCount = prev.memberCount;
      const nextMemberCount = next.memberCount;

      if (nextMemberCount < prevMemberCount) {
        const leftUserId = prev.memberIds.find((prevId) => {
          return !next.memberIds.find((nextId) => nextId === prevId);
        });

        this.emit(RoomEvents.MEMBER_LEFT, leftUserId);
      }
    }

    this._currentRoom = next;
  }

  private startLoopConnectionCheck(shouldReadyMemberCount: number) {
    logger.debug("check all members are ready.");

    const readyCount = Array.from(this._destinations.values()).filter(
      (dest) => {
        return dest.dataConnection.open === true;
      }
    ).length;

    if (readyCount === shouldReadyMemberCount) {
      logger.debug("all ready.");

      this.emit(RoomEvents.ALL_CONNECTIONS_READY);
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
