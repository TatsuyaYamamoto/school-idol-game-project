import { closeModal, openModal, P2PClient, t } from "@sokontokoro/mikan";

import Engine from "./Engine";
import globals from "../globals";
import { P2PEvents } from "../constants";
import { trySyncGameStart } from "../common";
import TopEngine from "./TopEngine";
import OnlineGameEngine from "./OnlineGameEngine";
import { to } from "../stateMachine";
import { Ids } from "../resources/string";

class OnlineGameOverEngine extends Engine {
  init(params) {
    super.init(params);
    const { result } = params;
    const {
      gameStage,
      player,
      opponent,
      playCharacter,
      ssObj,
      imageObj,
      textObj
    } = globals;

    if (result === "win") {
      opponent.img.gotoAndPlay("down");
    }
    if (result === "lose") {
      player.img.gotoAndPlay("down");
    }
    if (result === "draw") {
      player.img.gotoAndPlay("down");
      opponent.img.gotoAndPlay("down");
    }

    gameStage.removeAllChildren();

    switch (playCharacter) {
      case "honoka":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
        break;
      case "erichi":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("erichi");
        break;
    }

    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(opponent.img);
    gameStage.addChild(player.img);
    gameStage.addChild(imageObj.BUTTON_BACK_TOP_ONLINE);
    gameStage.addChild(imageObj.BUTTON_RESTART_ONLINE);
    gameStage.addChild(ssObj.BUTTON_TWITTER_GAMEOVER_SS);
    gameStage.addChild(textObj.TEXT_GAME_COUNT);

    if (result === "win") {
      gameStage.addChild(imageObj.GAMEOVER_WIN);
    }
    if (result === "lose") {
      gameStage.addChild(imageObj.GAMEOVER_LOSE);
    }
    if (result === "draw") {
      gameStage.addChild(imageObj.GAMEOVER_DRAW);
    }

    P2PClient.get().on(P2PClient.EVENTS.DATA, this.onDataReceived);
    imageObj.BUTTON_BACK_TOP_ONLINE.addEventListener(
      "mousedown",
      this.onClickBack
    );
    imageObj.BUTTON_RESTART_ONLINE.addEventListener(
      "mousedown",
      this.onClickRestart
    );
    createjs.Ticker.addEventListener("tick", this.progress);
  }

  tearDown() {
    super.tearDown();
    const { imageObj } = globals;

    P2PClient.get().off(P2PClient.EVENTS.DATA, this.onDataReceived);
    imageObj.BUTTON_BACK_TOP_ONLINE.removeEventListener(
      "mousedown",
      this.onClickBack
    );
    imageObj.BUTTON_RESTART_ONLINE.removeEventListener(
      "mousedown",
      this.onClickRestart
    );
    createjs.Ticker.removeEventListener("tick", this.progress);
  }

  progress() {
    globals.gameStage.update();
  }

  onClickBack() {
    P2PClient.get().disconnect();

    globals.soundObj.SOUND_BACK.play();
    to(TopEngine);
  }

  onClickRestart() {
    globals.soundObj.SOUND_BACK.play();

    openModal({
      title: t(Ids.ONLINE_DIALOG_REPLAY_WAITING_TEXT),
      actions: []
    });

    // TODO restartイベントをonする前にmessageを送信する可能性がある。
    const message = {
      type: P2PEvents.RESTART
    };
    P2PClient.get().send(message);
  }

  onDataReceived({ message }) {
    if (message.type === P2PEvents.RESTART) {
      openModal({
        title: t(Ids.ONLINE_DIALOG_REPLAY_CONFIRM_TITLE),
        text: t(Ids.ONLINE_DIALOG_REPLAY_CONFIRM_TEXT),
        actions: [
          {
            text: "OK",
            autoClose: true,
            onClick: () => {
              const message = {
                type: P2PEvents.RESTART_ACCEPT
              };
              P2PClient.get().send(message);

              openModal({
                title: t(Ids.ONLINE_DIALOG_READY_TITLE),
                text: t(Ids.ONLINE_DIALOG_READY_TEXT),
                actions: []
              });

              trySyncGameStart(false).then(() => {
                closeModal();
                to(OnlineGameEngine);
              });
            }
          },
          {
            text: "NO",
            onClick: () => {
              P2PClient.get().disconnect();

              globals.soundObj.SOUND_BACK.play();
              to(TopEngine);
            }
          }
        ]
      });
    }

    if (message.type === P2PEvents.RESTART_ACCEPT) {
      openModal({
        title: t(Ids.ONLINE_DIALOG_READY_TITLE),
        text: t(Ids.ONLINE_DIALOG_READY_TEXT),
        actions: []
      });

      trySyncGameStart(true).then(() => {
        closeModal();
        to(OnlineGameEngine);
      });
    }
  }
}

export default new OnlineGameOverEngine();
