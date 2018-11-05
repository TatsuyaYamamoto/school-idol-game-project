import {
  closeModal,
  openModal,
  t,
  tracePage,
  trackEvent,
  getLogger,
  SkyWayEvents
} from "@sokontokoro/mikan";

import TopEngine from "./TopEngine";
import OnlineGameEngine from "./OnlineGameEngine";
import { to } from "../stateMachine";

import Engine from "./Engine";
import globals from "../globals";
import { P2PEvents } from "../constants";
import {
  getClient as getSkyWayClient,
  unixtimeToRoundSeconds
} from "../common";

import { Ids } from "../resources/string";
import { TRACK_ACTION, TRACK_PAGES } from "../resources/config";

const logger = getLogger("online-game-over");

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

    tracePage(TRACK_PAGES.GAMEOVER_ONLINE);
    trackEvent(TRACK_ACTION.GAMEOVER, {
      label: "multi",
      value: params.passCarCount
    });

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
      case "eri":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("eri");
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

    getSkyWayClient().on(SkyWayEvents.DATA, this.onDataReceived);
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

    getSkyWayClient().off(SkyWayEvents.DATA, this.onDataReceived);
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
    getSkyWayClient().leaveRoom();

    globals.soundObj.SOUND_BACK.play();
    to(TopEngine);
  }

  onClickRestart() {
    globals.soundObj.SOUND_BACK.play();

    openModal({
      text: t(Ids.ONLINE_DIALOG_REPLAY_WAITING_TEXT),
      actions: []
    });

    // TODO restartイベントをonする前にmessageを送信する可能性がある。
    const message = {
      type: P2PEvents.RESTART
    };
    getSkyWayClient().send(message);
  }

  onDataReceived({ message }) {
    if (message.type === P2PEvents.RESTART) {
      logger.debug("receive restart request.");

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
              getSkyWayClient().send(message);

              openModal({
                title: t(Ids.ONLINE_DIALOG_READY_ROOM_TITLE),
                text: t(Ids.ONLINE_DIALOG_READY_ROOM_TEXT),
                actions: []
              });

              getSkyWayClient()
                .trySyncStartTime()
                .then(startTime => {
                  const now = Date.now();
                  const timeLeft = now < startTime ? startTime - now : 0;

                  openModal({
                    title: t(Ids.ONLINE_DIALOG_READY_ONLINE_GAME_TITLE),
                    text: t(Ids.ONLINE_DIALOG_READY_ONLINE_GAME_TEXT, {
                      timeLeft: unixtimeToRoundSeconds(timeLeft)
                    }),
                    actions: []
                  });

                  setTimeout(() => {
                    closeModal();
                    to(OnlineGameEngine);
                  }, timeLeft);
                });
            }
          },
          {
            text: "NO",
            onClick: () => {
              getSkyWayClient().leaveRoom();

              globals.soundObj.SOUND_BACK.play();
              to(TopEngine);
            }
          }
        ]
      });
    }

    if (message.type === P2PEvents.RESTART_ACCEPT) {
      logger.debug("receive restart accept message.");

      openModal({
        title: t(Ids.ONLINE_DIALOG_READY_ROOM_TITLE),
        text: t(Ids.ONLINE_DIALOG_READY_ROOM_TEXT),
        actions: []
      });

      getSkyWayClient()
        .trySyncStartTime()
        .then(startTime => {
          const now = Date.now();
          const timeLeft = now < startTime ? startTime - now : 0;

          openModal({
            title: t(Ids.ONLINE_DIALOG_READY_ONLINE_GAME_TITLE),
            text: t(Ids.ONLINE_DIALOG_READY_ONLINE_GAME_TEXT, {
              timeLeft: unixtimeToRoundSeconds(timeLeft)
            }),
            actions: []
          });

          setTimeout(() => {
            closeModal();
            to(OnlineGameEngine);
          }, timeLeft);
        });
    }
  }
}

export default new OnlineGameOverEngine();
