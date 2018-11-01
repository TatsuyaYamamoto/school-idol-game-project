enum SkyWayEvents {
  // SkyWay
  PEER_OPEN = "peerOpen",
  PEER_CALL = "peerCall",
  PEER_CLOSE = "peerClose",
  PEER_CONNECTION = "peerConnection",
  PEER_DISCONNECTED = "peerDisconnected",
  CREDENTIAL_EXPIRES_IN = "credentialExpiresIn",
  PEER_ERROR = "peerError",
  CONNECTION_OPENED = "connectionOpened",
  DATA = "data",
  CONNECTION_CLOSED = "connectionClosed",

  // mikan original event
  MEMBER_LOCK = "member_lock",
  MEMBER_FULFILLED = "member_fulfilled",
  MEMBER_LEFT = "member_left",
  READY = "ready" // all members connect to each other
}

export default SkyWayEvents;
