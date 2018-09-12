import * as alertify from "alertify/lib/alertify";
import { t } from "@sokontokoro/mikan";

import globals from "../globals";
import Engine from "./Engine";
import { postScore } from "../api";
import TopEngine from "./TopEngine";
import GameEngine from "./GameEngine";
import { to } from "../stateMachine";
import { getTweetText } from "../common";
import { Ids } from "../resources/string";
import { TRACK_ACTION, trackEvent } from "../tracker";

class GameOverEngine extends Engine {
  constructor(props) {
    super(props);

    this.onClickTweet = this.onClickTweet.bind(this);
  }

  init(params) {
    super.init();
    this.passCarCount = params.passCarCount;

    trackEvent(TRACK_ACTION.GAMEOVER, {
      label: "single",
      value: this.passCarCount
    });

    const {
      gameStage,
      player,
      playCharacter,
      ssObj,
      imageObj,
      textObj
    } = globals;

    postScore(this.passCarCount, playCharacter).then(response => {
      if (globals.isLogin) {
        if (response.ok) {
          alertify.log(t(Ids.REGISTER_SUCCESS), "success", 3000);
          return;
        }

        if (response.status === 401) {
          alertify.log(t(Ids.UNAUTHORIZED), "error", 3000);
        } else {
          alertify.log(t(Ids.UNEXPECTED_SERVER_ERROR), "error", 3000);
        }
      }
    });

    player.img.gotoAndPlay("down");

    gameStage.removeAllChildren();

    switch (playCharacter) {
      case "honoka":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
        break;
      case "eri":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("eri");
        break;
      case "kotori":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("eri");
        break;
    }

    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(player.img);
    gameStage.addChild(imageObj.BUTTON_BACK_TOP);
    gameStage.addChild(imageObj.BUTTON_RESTART);
    gameStage.addChild(ssObj.BUTTON_TWITTER_GAMEOVER_SS);
    gameStage.addChild(textObj.TEXT_GAME_COUNT);
    gameStage.addChild(imageObj.GAMEOVER);

    createjs.Ticker.addEventListener("tick", this.progress);

    imageObj.BUTTON_BACK_TOP.addEventListener("mousedown", this.onCLickBack);
    imageObj.BUTTON_RESTART.addEventListener("mousedown", this.onClickRestart);
    ssObj.BUTTON_TWITTER_GAMEOVER_SS.addEventListener(
      "mousedown",
      this.onClickTweet
    );
  }

  progress() {
    globals.gameStage.update();
  }

  tearDown() {
    super.tearDown();
    const { imageObj, ssObj } = globals;

    createjs.Ticker.removeEventListener("tick", this.progress);

    imageObj.BUTTON_BACK_TOP.removeEventListener("mousedown", this.onCLickBack);
    imageObj.BUTTON_RESTART.removeEventListener(
      "mousedown",
      this.onClickRestart
    );
    ssObj.BUTTON_TWITTER_GAMEOVER_SS.removeEventListener(
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

  onClickTweet() {
    const count = this.passCarCount;
    const chara = globals.playCharacter;

    trackEvent(TRACK_ACTION.CLICK, { label: "tweet" });

    window.location.href =
      "https://twitter.com/intent/tweet" +
      "?hashtags=ほのCar!+%23そこんところ工房" +
      "&text=" +
      getTweetText(count, chara) +
      "&url=http://games.sokontokoro-factory.net/honocar/";
  }
}

export default new GameOverEngine();
