import globals from "../globals";
import {
  closeModal,
  getCurrentUrl,
  getLogger,
  pointerdown,
  openModal,
  t,
  tracePage,
  ErrorCode
} from "@sokontokoro/mikan";
import { parse } from "query-string";

import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import OnlineGameEngine from "./OnlineGameEngine";

import {
  initClient as initSkyWayClient,
  getClient as getSkyWayClient
} from "../common";

import { trySyncGameStart } from "../common";
import { Ids } from "../resources/string";
import objectProps from "../resources/object-props";
import { TRACK_PAGES } from "../resources/config";

const logger = getLogger("top-engine");

class TopEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTop = this.onClickTop.bind(this);
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

    const roomName = parse(window.location.search).roomName;

    if (roomName) {
      openModal({
        title: t(Ids.ONLINE_DIALOG_TRY_CONNECT_TITLE),
        text: t(Ids.ONLINE_DIALOG_TRY_CONNECT_TEXT),
        actions: []
      });

      history.replaceState(null, null, getCurrentUrl());
      logger.debug(`try to connect to ${roomName}`);
      let client;

      Promise.resolve()
        .then(() => initSkyWayClient())
        .then(() => {
          logger.debug(`success to init skyway client`);
          client = getSkyWayClient();

          client.on("ready", () => {
            logger.debug(
              "all room members' connection are ready. start online game."
            );
            this.tryP2pConnect();
          });

          client.on("member_left", id => {
            logger.debug("room member left. close online mode.");
            this.leaveOnlineMode();
          });
        })
        .then(() => client.joinRoom(roomName))
        .catch(e => {
          logger.error(e.message);

          if (e.code === ErrorCode.FIREBASE_NO_ROOM) {
            openModal({
              title: t(Ids.ONLINE_DIALOG_ERROR_TITLE),
              text: t(Ids.ONLINE_DIALOG_ERROR_NO_ROOM_TEXT, { roomName }),
              actions: [{ text: "OK" }]
            });

            return;
          }

          throw e;
        });
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

  leaveOnlineMode() {
    getSkyWayClient().leaveRoom();

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

  tryP2pConnect() {
    openModal({
      title: t(Ids.ONLINE_DIALOG_READY_TITLE),
      text: t(Ids.ONLINE_DIALOG_READY_TEXT),
      actions: []
    });

    trySyncGameStart().then(() => {
      globals.soundObj.SOUND_ZENKAI.stop();
      closeModal();

      to(OnlineGameEngine);
    });
  }
}

const instance = new TopEngine();

export default instance;
