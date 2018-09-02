import Player from "./character/Player";
import Car from "./character/Car";
import { gameOverState } from "./stateMachine";
import globals from "./globals";
import { text_game_count_L, text_game_count_R } from "./resources/text";
import properties from "./resources/object-props";
import config from "./resources/config";

let cars = [];

//ゲーム初期化-----------------------------------------
export function init() {
  //honoka or erichiを作成
  //初期値はplayCharacter=honoka
  globals.player = new Player(globals.playCharacter);

  //フレーム数リセット
  gameStatusReset();

  //ボタン有効化
  rightButtonEnable();
  leftButtonEnable();

  //タイマーに関数セット
  globals.tickListener = createjs.Ticker.addEventListener("tick", gameReady);
}

function gameStatusReset() {
  globals.gameFrame = 0;
  globals.passCarCount = 0;
  cars = [];
}

function keyDownEvent(event) {
  const { imageObj } = globals;
  if (event.which == 37 && imageObj.BUTTON_LEFT.mouseEnabled) {
    clickButtonLeft();
  }
  if (event.keyCode == 39 && imageObj.BUTTON_RIGHT.mouseEnabled) {
    clickButtonRight();
  }
}

// ゲームスタートカウント-----------------------------------------
function gameReady() {
  const { gameStage, soundObj, imageObj, textObj, player } = globals;
  globals.gameFrame++;

  switch (globals.gameFrame) {
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
      createjs.Ticker.removeEventListener("tick", globals.tickListener);

      //ゲーム処理開始
      globals.tickListener = createjs.Ticker.addEventListener(
        "tick",
        processGame
      );
      //キーボード用keycodeevent登録
      window.addEventListener("keydown", keyDownEvent);
      soundObj.SOUND_SUSUME_LOOP.play({
        interrupt: "late",
        loop: -1,
        volume: 0.6
      });
      break;
  }
}

// ゲーム処理-----------------------------------------
function processGame() {
  const { textObj, gameStage, player } = globals;

  globals.gameFrame++;

  textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + globals.passCarCount + text_game_count_R;
  gameStage.update();

  if (globals.gameFrame % 20 === 0) {
    enemyAppeare();
  }

  cars.forEach(function(target, index) {
    if (target.passed) {
      cars.splice(index, 1);
      globals.passCarCount++;
    }

    if (player.lane == target.lane && checkDistance(target) < 0) {
      crash();
    }
  });
}

// 描画処理-----------------------------------------
function drawGameScrean() {
  const { gameStage, imageObj, textObj, player } = globals;

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
      cars.push(new Car(0));
      break;
    case 1:
      cars.push(new Car(1));
      break;
    case 2:
      cars.push(new Car(2));
      break;
    case 3:
      cars.push(new Car(3));
      break;
    case 4:
      cars.push(new Car(globals.player.lane));
      break;
    case 5:
      // なにもおきない
      break;
  }
}

// 操作ボタンの状態操作系---------------------------

// ボタン状態の確認
function checkButton() {
  const { player } = globals;

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
  globals.imageObj.BUTTON_RIGHT.mouseEnabled = true;
  globals.imageObj.BUTTON_RIGHT.alpha = 0.5;
}
function leftButtonEnable() {
  globals.imageObj.BUTTON_LEFT.mouseEnabled = true;
  globals.imageObj.BUTTON_LEFT.alpha = 0.5;
}

// 無効化
function rightButtonDisable() {
  globals.imageObj.BUTTON_RIGHT.mouseEnabled = false;
  globals.imageObj.BUTTON_RIGHT.alpha = 0.2;
}
function leftButtonDisable() {
  globals.imageObj.BUTTON_LEFT.mouseEnabled = false;
  globals.imageObj.BUTTON_LEFT.alpha = 0.2;
}

// オブジェクト間の距離計算(y軸方向のみ)---------------------
function checkDistance(target) {
  const { gameScreenScale, player } = globals;
  const { system } = config;
  const { ss } = properties;

  const y = player.img.y - target.img.y;

  var length =
    Math.abs(y) -
    system.car.height * gameScreenScale * system.difficultyLength -
    ss.PLAYER_HONOKA_SS.frames.height *
      gameScreenScale *
      system.difficultyLength;
  return length;
}
// イベント処理-------------------------------------
// TODO: remove export.
export function clickButtonRight() {
  globals.player.lane++;
  globals.soundObj.SOUND_KAIHI.play();
  globals.player.moveRight();

  checkButton();
}

// TODO: remove export.
export function clickButtonLeft() {
  globals.player.lane--;
  globals.player.moveLeft();
  globals.soundObj.SOUND_KAIHI.play();

  checkButton();
}
// クラッシュ関数-------------------------------------
function crash() {
  globals.textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + globals.passCarCount + text_game_count_R;
  globals.soundObj.SOUND_SUSUME_LOOP.stop();
  globals.soundObj.SOUND_CRASH.play();
  globals.soundObj.SOUND_SUSUME_END.play({ interrupt: "late", volume: 0.6 });

  // createjs.Ticker.reset();
  createjs.Ticker.removeEventListener("tick", globals.tickListener);

  //キーボード用keycodeevent削除
  window.removeEventListener("keydown", keyDownEvent);
  //stateマシン内、ゲームオーバー状態に遷移
  gameOverState();
}
