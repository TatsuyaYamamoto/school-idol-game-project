/**
 * SkyWay events
 */
export enum SkyWayEvents {
  PEER_OPEN = "skyway:peer-open",
  PEER_CALL = "skyway:peer-call",
  PEER_CLOSE = "skyway:peer-close",
  PEER_CONNECTION = "skyway:peer-connection",
  PEER_DISCONNECTED = "skyway:peer-disconnected",
  CREDENTIAL_EXPIRES_IN = "skyway:credential-expires-in",
  PEER_ERROR = "skyway:peerError",
  CONNECTION_OPENED = "skyway:connection-opened",
  DATA = "skyway:data",
  CONNECTION_CLOSED = "skyway:connection-closed"
}

/**
 * Room events
 */
export enum RoomEvents {
  MEMBER_LOCK = "room:member-lock",
  MEMBER_FULFILLED = "room:member-fulfilled",
  MEMBER_LEFT = "room:member-left",
  ALL_CONNECTIONS_READY = "room:all-connections-ready"
}
