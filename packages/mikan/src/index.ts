export { default as MikanError, ErrorCode } from "./MikanError";

/**
 * Model
 */
export { getRandomAnonymousName } from "./model/anonymous";
export { GAMES, Game, GameDetail, gameIds } from "./model/games";
export { MEMBERS, Member, MemberDetail, getMemberIcon } from "./model/members";

export { default as Application } from "./Application";

export {
  default as AssetLoader,
  Asset,
  ImageManifest,
  SoundManifest,
  loadTexture,
  loadFrames,
  loadSound
} from "./AssetLoader";

export { default as config } from "./config";

export { showIndicator, hideIndicator } from "./ui/Indicator";

export { show, hide } from "./ConnectingIndicator";

export { default as Deliverable } from "./Deliverable";

export { dispatchEvent, addEvents, removeEvents } from "./EventUtils";

export { initI18n, t, changeLanguage, getCurrentLanguage } from "./i18n";

export {
  play,
  playOnLoop,
  stop,
  toggleSound,
  isMute,
  resumeContext
} from "./MusicPlayer";

export { default as State } from "./State";

export { default as StateMachine } from "./StateMachine";

export {
  isIOS,
  getCurrentViewSize,
  getScale,
  pointerdown,
  isSupportPointerEvents,
  isSupportTouchEvents,
  isSupportTouchEvent,
  getRandomInteger,
  copyTextToClipboard,
  timeout,
  vibrate,
  getCurrentUrl,
  tweetByWebIntent,
  openExternalSite,
  convertYyyyMmDd
} from "./utils";

export { default as ViewContainer } from "./ViewContainer";

export { default as BrandLogoAnimation } from "./BrandLogoAnimation";

export { default as SkyWayCredential } from "./skyway/Credential";
export { default as SKyWayData, Message as SkyWayMessage } from "./skyway/Data";
export {
  default as SkyWayClient,
  SkyWayClientConstructorParams,
  Peer,
  PeerID,
  DataConnection,
  MediaConnection,
  Destination
} from "./skyway/SkyWayClient";
export { SkyWayEvents, RoomEvents } from "./skyway/SkyWayEvents";
export { default as NtpDate } from "./NtpDate";

export { openModal, closeModal } from "./Modal";

export { getLogger } from "./logger";

export {
  init as initTracker,
  tracePage,
  trackEvent,
  trackTiming,
  createUrchinTrackingModuleQuery
} from "./Tracker";

// firebase -----------------------------------------------------------------------
export { firebaseDb, firebaseAuth, callHttpsCallable } from "./firebase";

export {
  init as initAuth,
  getIdToken,
  signInAsAnonymous,
  signInAsTwitterUser,
  signOut
} from "./firebase/auth";

export { User, UserDocument } from "./firebase/User";
export {
  Presence,
  PresenceDocument,
  PresenceDbJson
} from "./firebase/Presence";
export { Playlog, PlaylogDocument } from "./firebase/Playlog";
export { Highscore, HighscoreDocument } from "./firebase/Highscore";
export {
  Credential,
  CredentialDocument,
  ProviderId
} from "./firebase/Credential";
export { Ranking, RankingDocument, RankItemDocument } from "./firebase/Ranking";
export { MetadataDocument } from "./firebase/Metadata";
export { Room, RoomName, RoomDocument } from "./firebase/Room";

export { devConfig as devFirebaseConfig } from "./firebase/config";

// util -----------------------------------------------------------------------
export { default as LimitedArray } from "./util/LimitedArray";
export { sum, mean } from "./util/Calculation";
