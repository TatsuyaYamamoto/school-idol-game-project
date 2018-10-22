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

export { default as P2PClient } from "./P2PClient";

export { openModal, closeModal } from "./Modal";

export { getLogger } from "./logger";

export {
  init as initTracker,
  tracePage,
  trackEvent,
  trackTiming,
  createUrchinTrackingModuleQuery
} from "./Tracker";

export { firebaseDb, firebaseAuth } from "./firebase";

export {
  init as initAuth,
  getIdToken,
  signInAsAnonymous,
  signInAsTwitterUser,
  signOut
} from "./firebase/auth";

export { Game, Member } from "./firebase/scheme";
export { User, UserDocument } from "./firebase/User";
export { Playlog, PlaylogDocument } from "./firebase/Playlog";
export { Highscore, HighscoreDocument } from "./firebase/Highscore";
export {
  Credential,
  CredentialDocument,
  ProviderId
} from "./firebase/Credential";
export { Ranking, RankingDocument, RankItemDocument } from "./firebase/Ranking";
export { MetadataDocument } from "./firebase/Metadata";

export { devConfig as devFirebaseConfig } from "./firebase/config";
