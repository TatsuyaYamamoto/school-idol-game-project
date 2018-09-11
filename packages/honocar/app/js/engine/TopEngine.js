import globals from "../globals";
import {
  closeModal,
  getCurrentUrl,
  getLogger,
  openModal,
  P2PClient,
  t
} from "@sokontokoro/mikan";
import { parse } from "query-string";

import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import OnlineGameEngine from "./OnlineGameEngine";

import { trySyncGameStart } from "../common";
import { Ids } from "../resources/string";

const logger = getLogger("top-engine");

class TopEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTop = this.onClickTop.bind(this);
    this.onP2pClosed = this.onP2pClosed.bind(this);
    this.onP2pConnect = this.onP2pConnect.bind(this);

    this.isConnectionRequester = false;
  }

  init(params) {
    super.init(params);

    const { playCharacter, gameStage, imageObj, textObj, soundObj } = globals;

    gameStage.removeAllChildren();
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.TITLE_LOGO);
    gameStage.addChild(textObj.TEXT_APP_VERSION);
    gameStage.addChild(textObj.TEXT_START);

    gameStage.update();

    if (soundObj.SOUND_ZENKAI.playState !== createjs.Sound.PLAY_SUCCEEDED) {
      soundObj.SOUND_ZENKAI.play({
        loop: -1,
        volume: 0.4
      });
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
      imageObj.GAME_BACKGROUND.addEventListener("click", this.onClickTop);
    }
  }

  tearDown() {
    globals.imageObj.GAME_BACKGROUND.removeEventListener(
      "click",
      this.onClickTop
    );
  }

  onClickTop() {
    globals.soundObj.SOUND_OK.play();
    globals.imageObj.GAME_BACKGROUND.removeEventListener(
      "click",
      this.onClickTop
    );

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
