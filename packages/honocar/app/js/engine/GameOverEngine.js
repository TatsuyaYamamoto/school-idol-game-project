import * as alertify from "alertify/lib/alertify";
import {
  t,
  tweetByWebIntent,
  getLogger,
  openModal,
  Playlog,
  tracePage
} from "@sokontokoro/mikan";

import globals from "../globals";
import Engine from "./Engine";
import TopEngine from "./TopEngine";
import GameEngine from "./GameEngine";
import { to } from "../stateMachine";
import { getTweetText } from "../common";

import { Ids } from "../resources/string";
import { TRACK_ACTION, TRACK_PAGES } from "../resources/config";

const logger = getLogger("gameover");

class GameOverEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTweet = this.onClickTweet.bind(this);
  }

  init(params) {
    super.init();

    tracePage(TRACK_PAGES.GAMEOVER);

    const {
      BUTTON_BACK_TOP,
      BUTTON_RESTART,
      GAME_BACKGROUND,
      GAMEOVER
    } = globals.imageObj;
    const { BUTTON_TWITTER_GAMEOVER_SS } = globals.ssObj;
    const { TEXT_GAME_COUNT } = globals.textObj;

    this.passCarCount = params.passCarCount;

    trackEvent(TRACK_ACTION.GAMEOVER, {
      label: "single",
      value: this.passCarCount
    });

    const { gameStage, player, playCharacter } = globals;

    Playlog.save("honocar", playCharacter, this.passCarCount).then(() => {
      if (!globals.loginUser.isAnonymous) {
        alertify.log(t(Ids.REGISTER_SUCCESS), "success", 3000);
      }
    });

    player.img.gotoAndPlay("down");

    gameStage.removeAllChildren();

    switch (playCharacter) {
      case "honoka":
        BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
        break;
      case "eri":
        BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("eri");
        break;
      case "kotori":
        BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("eri");
        break;
    }

    gameStage.addChild(GAME_BACKGROUND);
    gameStage.addChild(player.img);
    gameStage.addChild(BUTTON_BACK_TOP);
    gameStage.addChild(BUTTON_RESTART);
    gameStage.addChild(BUTTON_TWITTER_GAMEOVER_SS);
    gameStage.addChild(TEXT_GAME_COUNT);
    gameStage.addChild(GAMEOVER);

    createjs.Ticker.addEventListener("tick", this.progress);

    BUTTON_BACK_TOP.addEventListener("mousedown", this.onCLickBack);
    BUTTON_RESTART.addEventListener("mousedown", this.onClickRestart);
    BUTTON_TWITTER_GAMEOVER_SS.addEventListener("mousedown", this.onClickTweet);
  }

  progress() {
    globals.gameStage.update();
  }

  tearDown() {
    super.tearDown();
    const { BUTTON_BACK_TOP, BUTTON_RESTART } = globals.imageObj;
    const { BUTTON_TWITTER_GAMEOVER_SS } = globals.ssObj;

    createjs.Ticker.removeEventListener("tick", this.progress);

    BUTTON_BACK_TOP.removeEventListener("mousedown", this.onCLickBack);
    BUTTON_RESTART.removeEventListener("mousedown", this.onClickRestart);
    BUTTON_TWITTER_GAMEOVER_SS.removeEventListener(
      "mousedown",
      this.onClickTweet
    );
  }

  onClickRestart() {
    globals.soundObj.SOUND_BACK.play();
    to(GameEngine);

    trackEvent(TRACK_ACTION.CLICK, { label: "restart" });
  }

  onCLickBack() {
    globals.soundObj.SOUND_BACK.play();
    to(TopEngine);

    trackEvent(TRACK_ACTION.CLICK, { label: "back_from_gameover" });
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

            tweetByWebIntent({
              text: getTweetText(count, chara),
              url: "https://games.sokontokoro-factory.net/honocar/",
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

export default new GameOverEngine();
