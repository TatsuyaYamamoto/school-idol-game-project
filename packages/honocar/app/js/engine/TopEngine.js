import globals from "../globals";
import {
  closeModal,
  getCurrentUrl,
  getLogger,
  openModal,
  P2PClient
} from "@sokontokoro/mikan";
import { parse } from "query-string";

import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import OnlineGameEngine from "./OnlineGameEngine";

import { trySyncGameStart } from "../common";

const logger = getLogger("top-engine");

class TopEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTop = this.onClickTop.bind(this);
  }

  init(params) {
    super.init(params);

    const { playCharacter, gameStage, imageObj, textObj, soundObj } = globals;

    gameStage.removeAllChildren();
    gameStage.addChild(imageObj.GAME_BACKGROUND);

    switch (playCharacter) {
      case "honoka":
        gameStage.addChild(imageObj.TITLE_LOGO);
        break;
      case "erichi":
        gameStage.addChild(imageObj.TITLE_LOGO_E);
        break;
    }

    gameStage.addChild(textObj.TEXT_START);

    gameStage.update();

    if (soundObj.SOUND_ZENKAI.playState !== createjs.Sound.PLAY_SUCCEEDED) {
      soundObj.SOUND_ZENKAI.play({
        loop: -1,
        volume: 0.4
      });
    }

    imageObj.GAME_BACKGROUND.addEventListener("click", this.onClickTop);

    this.initP2p();
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

  initP2p() {
    // check online game state
    const p2p = P2PClient.get(process.env.SKYWAY_KEY);

    const remotePeerId = parse(window.location.search).peerId;
    history.replaceState(null, null, getCurrentUrl());

    p2p.once(P2PClient.EVENTS.CONNECT, () => {
      logger.info("success to connect to peer.");
      openModal({
        title: "準備完了",
        text: "オンライン対戦を開始します。",
        actions: []
      });

      const firstMessageSender = !remotePeerId; // connectionRequestReceiver

      trySyncGameStart(firstMessageSender).then(() => {
        globals.soundObj.SOUND_ZENKAI.stop();
        closeModal();

        to(OnlineGameEngine);
      });
    });

    p2p.once(P2PClient.EVENTS.CLOSE, params => {
      logger.info("close connection to peer.", params);

      if (!params.isByMyself) {
        openModal({
          title: "ゲーム終了",
          text: "通信相手の接続が切れてしまいました。Topに戻ります。",
          actions: []
        });

        setTimeout(() => {
          closeModal();
          to(instance);
        }, 3000);
      }
    });

    if (remotePeerId) {
      logger.debug(`try to connect to ${remotePeerId}`);
      p2p.connect(remotePeerId);
    }
  }
}

const instance = new TopEngine();

export default instance;
