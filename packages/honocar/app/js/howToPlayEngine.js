import globals from "./globals";
import { text_how_to, text_how_to_E } from "./resources/text";
import Player from "./character/Player";

//ゲーム初期化-----------------------------------------
export function init() {
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

  //ゲーム内タイマーTickイベント
  globals.tickListener = createjs.Ticker.addEventListener(
    "tick",
    processHowToPlay
  );
}

//ゲーム処理-----------------------------------------
function processHowToPlay() {
  globals.gameStage.update();
}
