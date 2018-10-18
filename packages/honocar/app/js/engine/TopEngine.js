import globals from "../globals";
import {
  closeModal,
  getCurrentUrl,
  getLogger,
  pointerdown,
  openModal,
  P2PClient,
  t,
  tracePage
} from "@sokontokoro/mikan";
import { parse } from "query-string";

import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import OnlineGameEngine from "./OnlineGameEngine";

import { trySyncGameStart } from "../common";
import { Ids } from "../resources/string";
import objectProps from "../resources/object-props";
import { TRACK_PAGES } from "../resources/config";

const logger = getLogger("top-engine");

class TopEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTop = this.onClickTop.bind(this);
    this.onP2pClosed = this.onP2pClosed.bind(this);
    this.onP2pConnect = this.onP2pConnect.bind(this);

    this.isConnectionRequester = false;
    this.titleLogo = null;
  }

  init(params) {
    super.init(params);

    tracePage(TRACK_PAGES.TOP);

    const {
      playCharacter,
      gameStage,
      gameScrean,
      imageObj,
      textObj,
      soundObj
    } = globals;

    const {
      TITLE_LOGO_HONOKA,
      TITLE_LOGO_ERI,
      TITLE_LOGO_KOTORI,
      GAME_BACKGROUND
    } = imageObj;
    const { TEXT_APP_VERSION, TEXT_START } = textObj;
    const { SOUND_ZENKAI } = soundObj;

    switch (playCharacter) {
      case "honoka":
        this.titleLogo = TITLE_LOGO_HONOKA;
        break;
      case "eri":
        this.titleLogo = TITLE_LOGO_ERI;
        break;
      case "kotori":
        this.titleLogo = TITLE_LOGO_KOTORI;
        break;
    }

    // Bad means!!
    // Move version text for kotori title logo layout.
    const versionRatioX = objectProps.text.TEXT_APP_VERSION.ratioX;
    if (playCharacter === "kotori") {
      TEXT_APP_VERSION.x = gameScrean.width * (1 - versionRatioX);
    } else {
      TEXT_APP_VERSION.x = gameScrean.width * versionRatioX;
    }

    gameStage.removeAllChildren();
    gameStage.addChild(GAME_BACKGROUND);
    gameStage.addChild(this.titleLogo);
    gameStage.addChild(TEXT_APP_VERSION);
    gameStage.addChild(TEXT_START);

    gameStage.update();

    if (SOUND_ZENKAI.playState !== createjs.Sound.PLAY_SUCCEEDED) {
      SOUND_ZENKAI.play({ loop: -1, volume: 0.4 });
    }

    const p2p = P2PClient.get(process.env.SKYWAY_KEY);

    p2p.once(P2PClient.EVENTS.CONNECT, this.onP2pConnect);
    p2p.once(P2PClient.EVENTS.CLOSE, this.onP2pClosed);

    const remotePeerId = parse(window.location.search).peerId;
    this.isConnectionRequester = !remotePeerId;
    if (remotePeerId) {
      history.replaceState(null, null, getCurrentUrl());

      logger.debug(`try to connect to ${remotePeerId}`);
      p2p.connect(remotePeerId);
    } else {
      window.addEventListener(pointerdown, this.onClickTop);
    }
  }

  tearDown() {
    window.removeEventListener(pointerdown, this.onClickTop);
    this.titleLogo = null;
  }

  onClickTop() {
    globals.soundObj.SOUND_OK.play();

    to(MenuEngine);
  }

  onP2pConnect() {
    logger.info("success to connect to peer.");
    openModal({
      title: t(Ids.ONLINE_DIALOG_READY_TITLE),
      text: t(Ids.ONLINE_DIALOG_READY_TEXT),
      actions: []
    });

    trySyncGameStart(this.isConnectionRequester).then(() => {
      globals.soundObj.SOUND_ZENKAI.stop();
      closeModal();

      to(OnlineGameEngine);
    });
  }

  onP2pClosed(params) {
    logger.info("close connection to peer.", params);

    if (!params.isByMyself) {
      openModal({
        title: t(Ids.ONLINE_DIALOG_DISCONNECTED_TITLE),
        text: t(Ids.ONLINE_DIALOG_DISCONNECTED_TEXT),
        actions: []
      });

      setTimeout(() => {
        closeModal();
        to(instance);
      }, 3000);
    }
  }
}

const instance = new TopEngine();

export default instance;
