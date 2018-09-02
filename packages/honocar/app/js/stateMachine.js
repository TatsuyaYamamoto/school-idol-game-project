import { init as initGameEngine } from "./gameEngine";
import { init as initHowToPlay } from "./howToPlayEngine";
import { isLogin, postPlayLog, registration } from "./common";
import { loadContent } from "./contentsLoader";
import globals from "./globals";

// ロード画面------------------------------------------
export function loadState() {
  loadContent(topState);
}

// TOP画面------------------------------------------
export function topState() {
  const { playCharacter, gameStage, imageObj, textObj, soundObj } = globals;

  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);

  switch (playCharacter) {
    case "honoka":
      gameStage.addChild(imageObj.TITLE_LOGO);
      break;
    case "erichi":
      gameStage.addChild(imageObj.TITLE_LOGO_E);
      break;
  }

  gameStage.addChild(textObj.TEXT_START);

  gameStage.update();

  if (soundObj.SOUND_ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
    soundObj.SOUND_ZENKAI.play("none", 0, 0, -1, 0.4, 0);
  }

  function gotoMenu() {
    globals.soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
    menuState();
    globals.imageObj.GAME_BACKGROUND.removeEventListener("click", gotoMenu);
  }

  imageObj.GAME_BACKGROUND.addEventListener("click", gotoMenu);
}

// MENU画面------------------------------------------
export function menuState() {
  const { playCharacter, gameStage, imageObj, ssObj, soundObj } = globals;

  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.WHITE_SHEET);

  if (globals.isLogin) {
    gameStage.addChild(imageObj.BUTTON_TWITTER_LOGOUT);
    gameStage.addChild(imageObj.TWITTER_ICON);
  } else {
    gameStage.addChild(imageObj.BUTTON_TWITTER_LOGIN);
  }

  gameStage.addChild(imageObj.BUTTON_START);
  gameStage.addChild(imageObj.BUTTON_HOW_TO);
  gameStage.addChild(imageObj.BUTTON_RANKING);
  gameStage.addChild(imageObj.BUTTON_CREDIT);
  gameStage.addChild(imageObj.BUTTON_TWITTER_TOP);
  gameStage.addChild(ssObj.BUTTON_SOUND_SS);
  gameStage.addChild(imageObj.MENU_LOGO);

  ssObj.BUTTON_CHANGE_CHARA.gotoAndPlay(playCharacter);
  gameStage.addChild(ssObj.BUTTON_CHANGE_CHARA);

  if (soundObj.SOUND_ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
    soundObj.SOUND_ZENKAI.play("none", 0, 0, -1, 0.4, 0);
  }

  globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });
}
//操作説明画面------------------------------------------
export function howToPlayState() {
  globals.gameStage.removeAllChildren();

  initHowToPlay();
}
//クレジット画面------------------------------------------
export function creditState() {
  const { gameStage, imageObj, textObj } = globals;

  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.BUTTON_BACK_TOP_FROM_CREDIT);
  gameStage.addChild(textObj.TEXT_LINK_ME);
  gameStage.addChild(textObj.TEXT_LINK_SAN);
  gameStage.addChild(textObj.TEXT_LINK_LOVELIVE);
  gameStage.addChild(textObj.TEXT_LINK_1);
  gameStage.addChild(textObj.TEXT_LINK_2);

  gameStage.update();
}

// ゲーム画面------------------------------------------
export function gameState() {
  globals.gameStage.removeAllChildren();

  initGameEngine();
}
// GAMEOVER画面------------------------------------------
export function gameOverState() {
  const {
    gameStage,
    player,
    playCharacter,
    ssObj,
    imageObj,
    textObj
  } = globals;

  if (globals.isLogin) {
    registration();
  }
  postPlayLog();

  player.img.gotoAndPlay("down");

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
  gameStage.addChild(player.img);
  gameStage.addChild(imageObj.BUTTON_BACK_TOP);
  gameStage.addChild(imageObj.BUTTON_RESTART);
  gameStage.addChild(ssObj.BUTTON_TWITTER_GAMEOVER_SS);
  gameStage.addChild(textObj.TEXT_GAME_COUNT);
  gameStage.addChild(imageObj.GAMEOVER);

  globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });
}
