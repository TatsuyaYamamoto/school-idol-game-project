//ゲーム初期化-----------------------------------------
function howToPlayInit() {
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
  player = new Player(playCharacter);
  gameStage.addChild(player.img);
  player.howToMove();

  //ゲーム内タイマーTickイベント
  tickListener = createjs.Ticker.addEventListener("tick", processHowToPlay);
}

//ゲーム処理-----------------------------------------
function processHowToPlay() {
  // gameFrame = Math.floor(createjs.Ticker.getTime());
  if (gameFrame == 100) {
    gameFrame = 0;
  }

  gameFrame++;
  gameStage.update();
}
