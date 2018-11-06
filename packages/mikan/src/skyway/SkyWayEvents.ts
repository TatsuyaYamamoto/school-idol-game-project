/**
 * SkyWay events
 */
export enum SkyWayEvents {
  PEER_OPEN = "peerOpen",
  PEER_CALL = "peerCall",
  PEER_CLOSE = "peerClose",
  PEER_CONNECTION = "peerConnection",
  PEER_DISCONNECTED = "peerDisconnected",
  CREDENTIAL_EXPIRES_IN = "credentialExpiresIn",
  PEER_ERROR = "peerError",
  CONNECTION_OPENED = "connectionOpened",
  DATA = "data",
  CONNECTION_CLOSED = "connectionClosed"
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
