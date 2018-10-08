const Peer = require("skyway-js");
import Autobind from "autobind-decorator";
import { EventEmitter } from "eventemitter3";
import { getLogger } from "./logger";
import { mean } from "./Calculation";

const logger = getLogger("p2p-client");

export enum EventType {
  CONNECT = "connect",
  CLOSE = "close",
  DATA = "data"
}

export type Peer = any;

export type P2PMessage = any;

export type Connection = any;

export interface P2PData {
  message: P2PMessage;
  time: number;
}

export type PeerID = string;

/**
 * P2P P2PClient.
 * This has {@link Peer} in internal.
 * @link https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/en/peer/
 */
@Autobind
class P2PClient extends EventEmitter {
  public static EVENTS = EventType;
  private static INSTANCE: P2PClient | null = null;
  private static PING_COUNT_FOR_AVERAGE = 5;

  readonly peer: Peer;
  private _connection: Connection | null = null;
  private _averagePing: number = 0;
  private _pingHistory: number[] = [];
  private _isDisconnectRequested: boolean = false;

  /**
   * Constructor
   *
   * @param key
   * @param peerId
   */
  private constructor(key: string, peerId?: string) {
    super();

    const peerOptions = {
      key,
      debug: 2,
      logFunction: (args: any) => logger.debug(args)
    };

    if (peerId) {
      this.peer = new Peer(peerId, peerOptions);
    } else {
      this.peer = new Peer(peerOptions);
    }

    this.peer.on("open", this.onPeerOpened);
    this.peer.on("connection", this.onPeerConnected);
    this.peer.on("error", this.onPeerError);
    this.peer.on("disconnected", this.onPeerClosed);
  }

  /**
   * Get {@code this} instance.
   *
   * @param key
   * @param peerId
   */
  public static get(key?: string, peerId?: string): P2PClient {
    if (this.INSTANCE) {
      return this.INSTANCE;
    }

    if (key) {
      if (peerId) {
        this.INSTANCE = new P2PClient(key, peerId);
      } else {
        this.INSTANCE = new P2PClient(key);
      }

      return P2PClient.get();
    }

    throw new Error(
      "P2PClient is not initialized. but no key is provided as args."
    );
  }

  /**
   * The Peer ID specified by a user or randomly assigned Peer ID by the signaling server.
   */
  public get peerId(): string | null {
    return this.peer.id;
  }

  /**
   * Whether the socket is connecting to the signalling server or not.
   */
  public get open(): boolean {
    return this.peer.open;
  }

  public get remotePeerId(): boolean {
    return this._connection.remoteId;
  }

  /**
   * Return an average of ping to remote peer.
   */
  public get averagePing(): number {
    return this._averagePing;
  }

  /**
   * Request connection to remote peer.
   *
   * @param remotePeerId
   */
  public connect(remotePeerId: PeerID) {
    logger.debug(`try connect. target PeerID: ${remotePeerId}`);

    // TODO: reconsider check state and try logic
    let max = 3;
    let tryCount = 0;

    return new Promise((resolve, reject) => {
      const tryConnect = () => {
        if (this.peer.open) {
          const connection = this.peer.connect(remotePeerId);
          this.setConnection(connection);
          resolve();
          this.emit(P2PClient.EVENTS.CONNECT);
        } else {
          tryCount++;
          if (max < tryCount) {
            logger.error("Failed to try connection. reach mac try count.");
            reject();
          }

          setTimeout(tryConnect, 1000);
        }
      };

      tryConnect();
    });
  }

  public disconnect() {
    if (!this._connection) {
      logger.error(
        "P2PClient doesn't have a connection. check whether you initialize a client or not."
      );
      return;
    }

    logger.debug(`try disconnect with remote peerID: ${this.remotePeerId}`);
    this._isDisconnectRequested = true;
    this._connection.close();
  }

  /**
   * Send data to peer.
   *
   * @param message
   */
  public send(message: P2PMessage) {
    if (!this._connection) {
      logger.error(
        "P2PClient doesn't have a connection. check whether you initialize a client or not."
      );
      return;
    }

    const data: P2PData = {
      message,
      time: Date.now()
    };

    // TODO: reconsider check state and try logic
    let max = 3;
    let tryCount = 0;

    return new Promise((resolve, reject) => {
      const trySend = () => {
        if (this._connection.open) {
          this._connection.send(data);
          logger.debug(`send data.`, data);
          resolve();
        } else {
          tryCount++;
          if (max < tryCount) {
            logger.error("Failed to try send. reach max try count.");
            reject();
          }

          setTimeout(trySend, 1000);
        }
      };

      trySend();
    });
  }

  private setConnection(connection: any) {
    connection.on("data", this.onDataReceived);
    connection.on("close", this.onConnectionClosed);

    this._connection = connection;
    this._isDisconnectRequested = false;
  }

  private onPeerOpened(id: PeerID) {
    logger.debug(`peer is opened. PeerID: ${id}`);
  }

  /**
   * 接続先のPeerからDataChannelの接続を受信した
   *
   * @param connection
   * @link https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#connection
   */
  private onPeerConnected(connection: any) {
    const connId = connection.id;
    const peerId = connection.remoteId;

    logger.debug(
      `peer is connected. ConnectionID: ${connId}, RemoteID: ${peerId}`
    );

    this.setConnection(connection);
    this.emit(P2PClient.EVENTS.CONNECT);
  }

  private onPeerError(e: Error) {
    logger.error("peer error occurred.", e);
  }

  private onPeerClosed(id: PeerID) {
    logger.debug(`peer is disconnected. PeerID: ${id}`);
  }

  private onDataReceived(data: P2PData) {
    const { time } = data;
    const ping = Date.now() - time;

    setTimeout(() => this.calcAveragePing(ping));

    logger.debug(`received message, ping: ${ping}ms`, data);

    this.emit(P2PClient.EVENTS.DATA, data);
  }

  private onConnectionClosed() {
    logger.debug(`connection is disconnected.`, this._connection);

    this.emit(P2PClient.EVENTS.CLOSE, {
      isByMyself: this._isDisconnectRequested
    });

    this._connection = null;
  }

  private calcAveragePing(newPing: number) {
    this._pingHistory.push(newPing);
    this._averagePing = mean(this._pingHistory);
    if (P2PClient.PING_COUNT_FOR_AVERAGE < this._pingHistory.length) {
      this._pingHistory.shift();
    }
  }
}

export default P2PClient;
