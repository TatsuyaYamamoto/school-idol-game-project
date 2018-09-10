import globals from "../globals";
import { text_how_to, text_how_to_E } from "../resources/text";
import Player from "../character/Player";
import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";

//ゲーム初期化-----------------------------------------

class HowToPlayEngine extends Engine {
  init() {
    super.init();

    const { gameStage, imageObj, playCharacter, textObj } = globals;

    //要素をステージに追加
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.BUTTON_BACK_TOP_FROM_HOW_TO);

    switch (playCharacter) {
      case "honoka":
        textObj.TEXT_HOW_TO.text = text_how_to;
        break;
      case "erichi":
        textObj.TEXT_HOW_TO.text = text_how_to_E;
        break;
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