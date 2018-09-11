import { t } from "@sokontokoro/mikan";

import globals from "../globals";
import Player from "../character/Player";
import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import { Ids } from "../resources/string";

//ゲーム初期化-----------------------------------------

class HowToPlayEngine extends Engine {
  init() {
    super.init();

    const { gameStage, imageObj, playCharacter, textObj } = globals;

    //要素をステージに追加
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.BUTTON_BACK_TOP_FROM_HOW_TO);

    switch (playCharacter) {
      case "kotori":
        textObj.TEXT_HOW_TO.text = t(Ids.HOW_TO_PLAY_KOTORI);
        break;
      case "erichi":
        textObj.TEXT_HOW_TO.text = t(Ids.HOW_TO_PLAY_ERI);
        break;
      case "honoka":
      default:
        textObj.TEXT_HOW_TO.text = t(Ids.HOW_TO_PLAY_HONOKA);
    }
    gameStage.addChild(textObj.TEXT_HOW_TO);

    //ほのかちゃを作成
    const player = new Player(playCharacter);
    player.howToMove();
    gameStage.addChild(player.img);

    globals.player = player;

    createjs.Ticker.addEventListener("tick", this.process);

    imageObj.BUTTON_BACK_TOP_FROM_HOW_TO.addEventListener(
      "mousedown",
      onClickBack
    );
  }

  tearDown() {
    super.tearDown();

    createjs.Tween.removeTweens(globals.player.img);
    createjs.Ticker.removeEventListener("tick", this.process);

    globals.imageObj.BUTTON_BACK_TOP_FROM_HOW_TO.removeEventListener(
      "mousedown",
      onClickBack
    );
  }

  process() {
    globals.gameStage.update();
  }
}

function onClickBack() {
  globals.soundObj.SOUND_BACK.play();

  to(MenuEngine);
}

export default new HowToPlayEngine();
