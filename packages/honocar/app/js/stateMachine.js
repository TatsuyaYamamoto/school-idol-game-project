// ロード画面------------------------------------------
function loadState() {
  loadContent(topState);
}

// TOP画面------------------------------------------
function topState() {
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
    soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
    menuState();
    imageObj.GAME_BACKGROUND.removeEventListener("click", gotoMenu);
  }

  imageObj.GAME_BACKGROUND.addEventListener("click", gotoMenu);
}

// MENU画面------------------------------------------
function menuState() {
  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.WHITE_SHEET);

  if (isLogin) {
    gameStage.addChild(imageObj.BUTTON_TWITTER_LOGOUT);
    gameStage.addChild(imageObj.TWITTER_ICON);
  } else {
    gameStage.addChild(imageObj.BUTTON_TWITTER_LOGIN);
  }

  gameStage.addChild(imageObj.BUTTON_START);
  gameStage.addChild(imageObj.BUTTON_HOW_TO);
  gameStage.addChild(imageObj.BUTTON_RANKING);
  gameStage.addChild(imageObj.BUTTON_CREDIT);
  gameStage.addChild(imageObj.BUTTON_REGUSTRATION_RANKING);
  gameStage.addChild(imageObj.BUTTON_TWITTER_TOP);
  gameStage.addChild(ssObj.BUTTON_SOUND_SS);
  gameStage.addChild(imageObj.MENU_LOGO);

  ssObj.BUTTON_CHANGE_CHARA.gotoAndPlay(playCharacter);
  gameStage.addChild(ssObj.BUTTON_CHANGE_CHARA);

  if (soundObj.SOUND_ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
    soundObj.SOUND_ZENKAI.play("none", 0, 0, -1, 0.4, 0);
  }

  tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });
}
//操作説明画面------------------------------------------
function howToPlayState() {
  gameStage.removeAllChildren();

  howToPlayInit();
}
//クレジット画面------------------------------------------
function creditState() {
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
function gameState() {
  gameStage.removeAllChildren();

  gameInit();
}
// GAMEOVER画面------------------------------------------
function gameOverState() {
  if (isLogin) {
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

  tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });
}
