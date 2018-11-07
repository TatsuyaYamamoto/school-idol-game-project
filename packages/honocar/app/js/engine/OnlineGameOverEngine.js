import {
  closeModal,
  openModal,
  t,
  tracePage,
  trackEvent,
  getLogger,
  SkyWayEvents,
  convertYyyyMmDd,
  createUrchinTrackingModuleQuery,
  tweetByWebIntent,
  NtpDate
} from "@sokontokoro/mikan";

import TopEngine from "./TopEngine";
import OnlineGameEngine from "./OnlineGameEngine";
import { to } from "../stateMachine";

import Engine from "./Engine";
import globals from "../globals";
import { P2PEvents } from "../constants";
import {
  getClient as getSkyWayClient,
  getTweetText,
  unixtimeToRoundSeconds
} from "../common";

import { Ids } from "../resources/string";
import {
  default as config,
  TRACK_ACTION,
  TRACK_PAGES
} from "../resources/config";

const logger = getLogger("online-game-over");

class OnlineGameOverEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTweet = this.onClickTweet.bind(this);
  }

  init(params) {
    super.init(params);

    this.passCarCount = params.passCarCount;

    tracePage(TRACK_PAGES.GAMEOVER_ONLINE);
    trackEvent(TRACK_ACTION.GAMEOVER, {
      label: "multi",
      value: this.passCarCount
    });

    const { result } = params;
    const { gameStage, player, opponent, playCharacter, textObj } = globals;
    const {
      BUTTON_BACK_TOP_ONLINE,
      BUTTON_RESTART_ONLINE,
      GAME_BACKGROUND,
      GAMEOVER_WIN,
      GAMEOVER_LOSE,
      GAMEOVER_DRAW
    } = globals.imageObj;
    const { BUTTON_TWITTER_GAMEOVER_SS } = globals.ssObj;

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
        BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
        break;
      case "eri":
        BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("eri");
        break;
    }

    gameStage.addChild(GAME_BACKGROUND);
    gameStage.addChild(opponent.img);
    gameStage.addChild(player.img);
    gameStage.addChild(BUTTON_BACK_TOP_ONLINE);
    gameStage.addChild(BUTTON_RESTART_ONLINE);
    gameStage.addChild(BUTTON_TWITTER_GAMEOVER_SS);
    gameStage.addChild(textObj.TEXT_GAME_COUNT);

    if (result === "win") {
      gameStage.addChild(GAMEOVER_WIN);
    }
    if (result === "lose") {
      gameStage.addChild(GAMEOVER_LOSE);
    }
    if (result === "draw") {
      gameStage.addChild(GAMEOVER_DRAW);
    }

    getSkyWayClient().on(SkyWayEvents.DATA, this.onDataReceived);

    BUTTON_BACK_TOP_ONLINE.addEventListener("mousedown", this.onClickBack);
    BUTTON_RESTART_ONLINE.addEventListener("mousedown", this.onClickRestart);
    BUTTON_TWITTER_GAMEOVER_SS.addEventListener("mousedown", this.onClickTweet);

    createjs.Ticker.addEventListener("tick", this.progress);
  }

  tearDown() {
    super.tearDown();
    const { BUTTON_BACK_TOP_ONLINE, BUTTON_RESTART_ONLINE } = globals.imageObj;
    const { BUTTON_TWITTER_GAMEOVER_SS } = globals.ssObj;

    BUTTON_BACK_TOP_ONLINE.removeEventListener("mousedown", this.onClickBack);
    BUTTON_RESTART_ONLINE.removeEventListener("mousedown", this.onClickRestart);
    BUTTON_TWITTER_GAMEOVER_SS.removeEventListener(
      "mousedown",
      this.onClickTweet
    );

    getSkyWayClient().off(SkyWayEvents.DATA, this.onDataReceived);

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
    const startGameAfterSync = () => {
      openModal({
        title: t(Ids.ONLINE_DIALOG_READY_ROOM_TITLE),
        text: t(Ids.ONLINE_DIALOG_READY_ROOM_TEXT),
        actions: []
      });

      getSkyWayClient()
        .trySyncStartTime()
        .then(startTime => {
          const now = NtpDate.now();
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
    };

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
              startGameAfterSync();
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
      startGameAfterSync();
    }
  }

  onClickTweet(e) {
    globals.soundObj.SOUND_OK.stop();
    globals.soundObj.SOUND_OK.play();

    openModal({
      text: t(Ids.OPEN_EXTERNAL_SITE_INFO, { domain: "twitter.com" }),
      actions: [
        {
          text: "OK",
          onClick: () => {
            globals.soundObj.SOUND_OK.stop();
            globals.soundObj.SOUND_OK.play();

            const count = this.passCarCount;
            const chara = globals.playCharacter;

            trackEvent(TRACK_ACTION.CLICK, { label: "tweet" });

            const yyyymmdd = convertYyyyMmDd(new Date());
            const utmQuery = createUrchinTrackingModuleQuery({
              campaign: `result-share_${yyyymmdd}`,
              source: "twitter",
              medium: "social"
            });
            const url = `${config.link.game}?${utmQuery.join("&")}`;

            tweetByWebIntent({
              text: getTweetText(count, chara),
              url,
              hashtags: ["ほのCar", "そこんところ工房"]
            });
          }
        },
        {
          text: "CANCEL",
          type: "cancel",
          onClick: () => {
            globals.soundObj.SOUND_BACK.stop();
            globals.soundObj.SOUND_BACK.play();
          }
        }
      ]
    });
  }
}

export default new OnlineGameOverEngine();
