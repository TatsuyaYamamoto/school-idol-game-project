import Peer from "skyway-js";
import Autobind from "autobind-decorator";
import { EventEmitter } from "eventemitter3";
import { getLogger } from "./logger";

const logger = getLogger("p2p-client");

enum EventType {
  CONNECT = "connect",
  DATA = "data"
}

type P2PMessage = any;

interface P2PData {
  message: P2PMessage;
  time: number;
}

/**
 * P2P P2PClient.
 * This has {@link Peer} in internal.
 * @link https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/en/peer/
 */
@Autobind
class P2PClient extends EventEmitter {
  public static events = EventType;
  private static _instance: object | null = null;

  readonly peer;
  private _connection = null;

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
      logFunction: args => logger.debug(args)
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
  public static get(key?: string, peerId?: string) {
    if (this._instance) {
      return this._instance;
    }

    if (key) {
      if (peerId) {
        this._instance = new P2PClient(key, peerId);
      } else {
        this._instance = new P2PClient(key);
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

  /**
   * Request connection to remote peer.
   *
   * @param remotePeerId
   */
  public connect(remotePeerId) {
    logger.debug(`try connect. target PeerID: ${remotePeerId}`);

    // TODO check peer status.
    let max = 3;
    let tryCount = 0;

    return new Promise((resolve, reject) => {
      const tryConnect = () => {
        try {
          const connection = this.peer.connect(remotePeerId);
          this.setConnection(connection);
          resolve();
          this.emit(P2PClient.events.CONNECT);
        } catch (e) {
          tryCount++;
          if (max < tryCount) {
            logger.error("Failed to try connection. reach mac try count.");
            reject(e);
          }

          setTimeout(tryConnect, 1000);
        }
      };

      tryConnect();
    });
  }

  /**
   * Send data to peer.
   *
   * @param message
   */
  public send(message: P2PMessage) {
    if (!this._connection) {
      return;
    }

    const data: P2PData = {
      message,
      time: Date.now()
    };

    this._connection.send(data);
    logger.debug(`send data.`, data);
  }

  private setConnection(connection) {
    this._connection = connection;

    this._connection.on("data", this.onDataReceived);
    this._connection.on("close", this.onConnectionClosed);
  }

  private onPeerOpened(id) {
    logger.debug(`peer is opened. PeerID: ${id}`);
  }

  /**
   * 接続先のPeerからDataChannelの接続を受信した
   *
   * @param connection
   * @link https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#connection
   */
  private onPeerConnected(connection) {
    const connId = connection.id;
    const peerId = connection.peer;

    logger.debug(
      `peer is connected. ConnectionID: ${connId}, RemoteID: ${peerId}`
    );

    this.setConnection(connection);

    const firstSignal = () => {
      if (connection.open) {
        this.send("connection check message. remote PeerID is " + this.peerId);
      } else {
        setTimeout(firstSignal, 500);
      }
    };

    firstSignal();

    this.emit(P2PClient.events.CONNECT);
  }

  private onPeerError(e) {
    logger.error("peer error occurred.", e);
  }

  private onPeerClosed(id) {
    logger.debug(`peer is disconnected. PeerID: ${id}`);
  }

  private onDataReceived(data: P2PData) {
    const { message, time } = data;
    const ping = Date.now() - time;

    logger.debug(`received message, ping: ${ping}ms`, data);

    this.emit(P2PClient.events.DATA, data);
  }

  private onConnectionClosed() {
    logger.debug(`connection is disconnected. connection: ${this._connection}`);
    this._connection = null;
  }
}

export default P2PClient;
