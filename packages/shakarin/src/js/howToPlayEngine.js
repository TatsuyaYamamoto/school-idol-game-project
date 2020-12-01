//ゲーム初期化-----------------------------------------
function howToPlayInit() {
  // りんちゃん作成
  _player = new Player(_playCharacter);
  gameStatusReset();
  allButtonDisable();

  //キーボード用keycodeevent登録
  window.addEventListener("keyup", keyDownEvent);

  // switch(playCharacter){
  //     case "honoka":
  //         textObj.TEXT_HOW_TO.text = text_how_to;
  //         break;
  //     case "erichi":
  //         textObj.TEXT_HOW_TO.text = text_how_to_E;
  //         break;
  // }
  // gameStage.addChild(textObj.TEXT_HOW_TO);

  addChildren([
    _imageObj.BACKGROUND,
    _imageObj.BUTTON_LEFT,
    _imageObj.BUTTON_RIGHT,
    _imageObj.BUTTON_TOP,
    _imageObj.BUTTON_BOTTOM,
    _imageObj.BUTTON_BACK_MENU_FROM_HOW,
    _textObj.HOW_TO_PLAY,
    _player.img,
  ]);

  // HowToPlayアニメーション開始
  _tickListener = createjs.Ticker.addEventListener("tick", processHowToPlay);
}

//ゲーム処理-----------------------------------------
function processHowToPlay() {
  if (_gameFrame % 20 === 0) {
    _player.changeDirection();
    _player.wait();
    checkButtonStatus();
  }

  _gameFrame++;
  _gameStage.update();
}

function endHowToPlay() {
  createjs.Ticker.removeEventListener("tick", _tickListener);
  //キーボード用keycodeevent削除
  window.removeEventListener("keyup", keyDownEvent);
}
