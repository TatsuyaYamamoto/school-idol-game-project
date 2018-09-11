import globals from "../globals";
import Engine from "./Engine";
import { postPlayLog, registration } from "../api";
import TopEngine from "./TopEngine";
import GameEngine from "./GameEngine";
import { to } from "../stateMachine";
import { getTweetText } from "../common";

class GameOverEngine extends Engine {
  init(params) {
    super.init();
    this.passCarCount = params.passCarCount;
    const {
      gameStage,
      player,
      playCharacter,
      ssObj,
      imageObj,
      textObj
    } = globals;

    if (globals.isLogin) {
      registration(this.passCarCount);
    }
    postPlayLog(this.passCarCount);

    player.img.gotoAndPlay("down");

    gameStage.removeAllChildren();

    switch (playCharacter) {
      case "honoka":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
        break;
      case "erichi":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("erichi");
        break;
      case "kotori":
        ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("erichi");
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
  }

  onCLickBack() {
    globals.soundObj.SOUND_BACK.play();
    to(TopEngine);
  }

  onClickTweet() {
    window.location.href =
      "https://twitter.com/intent/tweet" +
      "?hashtags=ほのCar!+%23そこんところ工房" +
      "&text=" +
      getTweetText(this.passCarCount) +
      "&url=http://games.sokontokoro-factory.net/honocar/";
  }
}

export default new GameOverEngine();
