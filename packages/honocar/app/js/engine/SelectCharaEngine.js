import globals from "../globals";
import Player from "../character/Player";
import { to } from "../stateMachine";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";

//ゲーム初期化-----------------------------------------

class SelectCharaEngine extends Engine {
  constructor(props) {
    super(props);

    this.honoka = null;
    this.kotori = null;
    this.erichi = null;
  }

  init() {
    super.init();

    const { gameStage, gameScrean, imageObj } = globals;

    //要素をステージに追加
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.BUTTON_BACK_TOP_FROM_HOW_TO);

    this.honoka = new Player("honoka");
    this.honoka.img.x = gameScrean.width * 0.5;
    this.honoka.img.y = gameScrean.height * 0.6;

    this.kotori = new Player("kotori");
    this.kotori.img.x = gameScrean.width * 0.2;
    this.kotori.img.y = gameScrean.height * 0.4;

    this.erichi = new Player("erichi");
    this.erichi.img.x = gameScrean.width * 0.8;
    this.erichi.img.y = gameScrean.height * 0.4;

    gameStage.addChild(this.honoka.img);
    gameStage.addChild(this.kotori.img);
    gameStage.addChild(this.erichi.img);

    createjs.Ticker.addEventListener("tick", this.process);
    this.honoka.img.addEventListener("mousedown", onSelectHonoka);
    this.kotori.img.addEventListener("mousedown", onSelectKotori);
    this.erichi.img.addEventListener("mousedown", onSelectErihci);
    imageObj.BUTTON_BACK_TOP_FROM_HOW_TO.addEventListener(
      "mousedown",
      onClickBack
    );
  }

  tearDown() {
    super.tearDown();

    createjs.Ticker.removeEventListener("tick", this.process);
    this.honoka.img.removeEventListener("mousedown", onSelectHonoka);
    this.kotori.img.removeEventListener("mousedown", onSelectKotori);
    this.erichi.img.removeEventListener("mousedown", onSelectErihci);
    globals.imageObj.BUTTON_BACK_TOP_FROM_HOW_TO.removeEventListener(
      "mousedown",
      onClickBack
    );

    this.honoka = null;
    this.kotori = null;
    this.erichi = null;
  }

  process() {
    globals.gameStage.update();
  }
}

function onClickBack() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_BACK.play();

  to(MenuEngine);
}

function onSelectHonoka() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  globals.playCharacter = "honoka";

  to(MenuEngine);
}

function onSelectKotori() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  globals.playCharacter = "kotori";

  to(MenuEngine);
}

function onSelectErihci() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  globals.playCharacter = "erichi";

  to(MenuEngine);
}

export default new SelectCharaEngine();