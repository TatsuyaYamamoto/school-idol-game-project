//ゲーム初期化-----------------------------------------
function gameInit() {
  //honoka or erichiを作成
  //初期値はplayCharacter=honoka
  player = new Player(playCharacter);

  //フレーム数リセット
  gameStatusReset();

  //ボタン有効化
  rightButtonEnable();
  leftButtonEnable();

  //タイマーに関数セット
  tickListener = createjs.Ticker.addEventListener("tick", gameReady);
}

function gameStatusReset() {
  gameFrame = 0;
  passCarCount = 0;
  car = [];
}

function keyDownEvent(event) {
  if (event.which == 37 && imageObj.BUTTON_LEFT.mouseEnabled) {
    clickButtonLeft();
  }
  if (event.keyCode == 39 && imageObj.BUTTON_RIGHT.mouseEnabled) {
    clickButtonRight();
  }
}

// ゲームスタートカウント-----------------------------------------
function gameReady() {
  gameFrame++;

  switch (gameFrame) {
    case 1:
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(player.img);
      gameStage.update();
      break;
    case 10:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-2-";
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(player.img);
      gameStage.update();
      break;
    case 30:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-1-";
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(player.img);
      gameStage.update();
      break;
    case 50:
      soundObj.SOUND_PI2.play();
      gameStage.removeAllChildren();
      gameStatusReset();
      drawGameScrean();
      createjs.Ticker.removeEventListener("tick", tickListener);

      //ゲーム処理開始
      tickListener = createjs.Ticker.addEventListener("tick", processGame);
      //キーボード用keycodeevent登録
      window.addEventListener("keydown", keyDownEvent);
      soundObj.SOUND_SUSUME_LOOP.play("late", 0, 0, -1, 0.6, 0);
      break;
  }
}

// ゲーム処理-----------------------------------------
function processGame() {
  gameFrame++;

  textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + passCarCount + text_game_count_R;
  gameStage.update();

  if (gameFrame % 20 == 0) {
    enemyAppeare();
  }

  car.forEach(function(target, index) {
    if (target.passed) {
      car.splice(index, 1);
      passCarCount++;
    }

    if (player.lane == target.lane && checkDistance(target) < 0) {
      crash();
    }
  });
}

// 描画処理-----------------------------------------
function drawGameScrean() {
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.BUTTON_LEFT);
  gameStage.addChild(imageObj.BUTTON_RIGHT);
  gameStage.addChild(textObj.TEXT_GAME_COUNT);
  gameStage.addChild(player.img);
}

// 敵出現---------------------------------------
function enemyAppeare() {
  var enemyNumber = Math.floor(Math.random() * 5);

  switch (enemyNumber) {
    case 0:
      car.push(new Car(0));
      break;
    case 1:
      car.push(new Car(1));
      break;
    case 2:
      car.push(new Car(2));
      break;
    case 3:
      car.push(new Car(3));
      break;
    case 4:
      car.push(new Car(player.lane));
      break;
    case 5:
      // なにもおきない
      break;
  }
}

// 操作ボタンの状態操作系---------------------------

// ボタン状態の確認
function checkButton() {
  if (player.lane == 0) {
    leftButtonDisable();
  }
  if (player.lane == 1) {
    leftButtonEnable();
  }
  if (player.lane == 2) {
    rightButtonEnable();
  }
  if (player.lane == 3) {
    rightButtonDisable();
  }
}

// 有効化
function rightButtonEnable() {
  imageObj.BUTTON_RIGHT.mouseEnabled = true;
  imageObj.BUTTON_RIGHT.alpha = 0.5;
}
function leftButtonEnable() {
  imageObj.BUTTON_LEFT.mouseEnabled = true;
  imageObj.BUTTON_LEFT.alpha = 0.5;
}

// 無効化
function rightButtonDisable() {
  imageObj.BUTTON_RIGHT.mouseEnabled = false;
  imageObj.BUTTON_RIGHT.alpha = 0.2;
}
function leftButtonDisable() {
  imageObj.BUTTON_LEFT.mouseEnabled = false;
  imageObj.BUTTON_LEFT.alpha = 0.2;
}

// オブジェクト間の距離計算(y軸方向のみ)---------------------
function checkDistance(target) {
  var y = player.img.y - target.img.y;

  var length =
    Math.abs(y) -
    config.system.car.height *
      gameScreenScale *
      config.system.difficultyLength -
    properties.ss.PLAYER_HONOKA_SS.frames.height *
      gameScreenScale *
      config.system.difficultyLength;
  return length;
}
// イベント処理-------------------------------------

function clickButtonRight() {
  player.lane++;
  soundObj.SOUND_KAIHI.play("none", 0, 0, 0, 1, 0);
  player.moveRight();
  checkButton();
}

function clickButtonLeft() {
  player.lane--;
  player.moveLeft();
  soundObj.SOUND_KAIHI.play("none", 0, 0, 0, 1, 0);
  checkButton();
}
// クラッシュ関数-------------------------------------
function crash() {
  gameScore = passCarCount;
  textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + gameScore + text_game_count_R;
  soundObj.SOUND_SUSUME_LOOP.stop();
  soundObj.SOUND_CRASH.play();
  soundObj.SOUND_SUSUME_END.play("late", 0, 0, 0, 0.6, 0);

  // createjs.Ticker.reset();
  createjs.Ticker.removeEventListener("tick", tickListener);

  //キーボード用keycodeevent削除
  window.removeEventListener("keydown", keyDownEvent);
  //stateマシン内、ゲームオーバー状態に遷移
  gameOverState();
}
