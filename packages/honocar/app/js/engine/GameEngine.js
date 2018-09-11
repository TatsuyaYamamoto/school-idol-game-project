import Player from "../character/Player";
import Car from "../character/Car";
import globals from "../globals";
import { text_game_count_L, text_game_count_R } from "../resources/text";
import properties from "../resources/object-props";
import config from "../resources/config";
import Engine from "./Engine";
import GameOverEngine from "./GameOverEngine";
import { to } from "../stateMachine";

let cars = [];
let gameFrame = 0;
let passCarCount = 0;

class GameEngine extends Engine {
  init() {
    super.init();
    const { imageObj } = globals;

    //honoka or erichiを作成
    //初期値はplayCharacter=honoka
    globals.player = new Player(globals.playCharacter);

    //フレーム数リセット
    gameStatusReset();

    //ボタン有効化
    checkButton();

    //タイマーに関数セット
    createjs.Ticker.addEventListener("tick", gameReady);
    window.addEventListener("keydown", keyDownEvent);

    imageObj.BUTTON_RIGHT.addEventListener("mousedown", clickButtonRight);
    imageObj.BUTTON_LEFT.addEventListener("mousedown", clickButtonLeft);
  }

  tearDown() {
    super.tearDown();
    const { imageObj } = globals;

    createjs.Ticker.removeEventListener("tick", gameReady);
    createjs.Ticker.removeEventListener("tick", processGame);
    window.removeEventListener("keydown", keyDownEvent);

    imageObj.BUTTON_RIGHT.removeEventListener("mousedown", clickButtonRight);
    imageObj.BUTTON_LEFT.removeEventListener("mousedown", clickButtonLeft);
  }
}

function gameStatusReset() {
  gameFrame = 0;
  passCarCount = 0;
  cars = [];
}

// ゲームスタートカウント-----------------------------------------
function gameReady() {
  const { gameStage, soundObj, imageObj, textObj, player } = globals;
  gameFrame++;

  switch (gameFrame) {
    case 1:
      gameStage.removeAllChildren();
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(player.img);

      break;
    case 10:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-2-";

      gameStage.removeAllChildren();
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(player.img);
      break;
    case 30:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-1-";

      gameStage.removeAllChildren();
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(player.img);
      break;
    case 50:
      soundObj.SOUND_PI2.play();

      gameStage.removeAllChildren();
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(imageObj.BUTTON_LEFT);
      gameStage.addChild(imageObj.BUTTON_RIGHT);
      gameStage.addChild(textObj.TEXT_GAME_COUNT);
      gameStage.addChild(player.img);

      gameStatusReset();

      createjs.Ticker.removeEventListener("tick", gameReady);
      createjs.Ticker.addEventListener("tick", processGame);

      soundObj.SOUND_SUSUME_LOOP.play({
        interrupt: "late",
        loop: -1,
        volume: 0.6
      });
      break;
  }
  gameStage.update();
}

// ゲーム処理-----------------------------------------
function processGame() {
  const { textObj, gameStage, player } = globals;

  gameFrame++;

  textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + passCarCount + text_game_count_R;
  gameStage.update();

  if (gameFrame % 20 === 0) {
    enemyAppeare();
  }

  cars.forEach(function(target, index) {
    if (target.passed) {
      cars.splice(index, 1);
      passCarCount++;
    }

    if (player.lane == target.lane && checkDistance(target) < 0) {
      crash();
    }
  });
}

// 敵出現---------------------------------------
function enemyAppeare() {
  var enemyNumber = Math.floor(Math.random() * 5);

  pushCar(enemyNumber);
}

function pushCar(enemyNumber) {
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

// ボタン状態の確認
export function checkButton() {
  const { player } = globals;

  if (player.lane === 0) {
    leftButtonDisable();
    rightButtonEnable();
  }
  if (player.lane === 1 || player.lane === 2) {
    leftButtonEnable();
    rightButtonEnable();
  }
  if (player.lane === 3) {
    leftButtonEnable();
    rightButtonDisable();
  }
}

// 有効化
export function rightButtonEnable() {
  globals.imageObj.BUTTON_RIGHT.mouseEnabled = true;
  globals.imageObj.BUTTON_RIGHT.alpha = 0.5;
}
export function leftButtonEnable() {
  globals.imageObj.BUTTON_LEFT.mouseEnabled = true;
  globals.imageObj.BUTTON_LEFT.alpha = 0.5;
}

// 無効化
export function rightButtonDisable() {
  globals.imageObj.BUTTON_RIGHT.mouseEnabled = false;
  globals.imageObj.BUTTON_RIGHT.alpha = 0.2;
}
export function leftButtonDisable() {
  globals.imageObj.BUTTON_LEFT.mouseEnabled = false;
  globals.imageObj.BUTTON_LEFT.alpha = 0.2;
}

// オブジェクト間の距離計算(y軸方向のみ)---------------------
export function checkDistance(target) {
  const { gameScreenScale, player } = globals;
  const { system } = config;
  const { ss } = properties;

  const y = player.img.y - target.img.y;

  return (
    Math.abs(y) -
    system.car.height * gameScreenScale * system.difficultyLength -
    ss.PLAYER_HONOKA_SS.frames.height *
      gameScreenScale *
      system.difficultyLength
  );
}
// イベント処理-------------------------------------
function keyDownEvent(event) {
  const { imageObj } = globals;
  if (event.which === 37 && imageObj.BUTTON_LEFT.mouseEnabled) {
    clickButtonLeft();
  }
  if (event.keyCode === 39 && imageObj.BUTTON_RIGHT.mouseEnabled) {
    clickButtonRight();
  }
}

function clickButtonRight() {
  globals.player.lane++;
  globals.player.moveRight();

  // TODO reconsider how to set interrupt
  globals.soundObj.SOUND_KAIHI.stop();
  globals.soundObj.SOUND_KAIHI.play();

  checkButton();
}

function clickButtonLeft() {
  globals.player.lane--;
  globals.player.moveLeft();

  // TODO reconsider how to set interrupt
  globals.soundObj.SOUND_KAIHI.stop();
  globals.soundObj.SOUND_KAIHI.play();

  checkButton();
}
// クラッシュ関数-------------------------------------
function crash() {
  globals.textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + passCarCount + text_game_count_R;
  globals.soundObj.SOUND_SUSUME_LOOP.stop();
  globals.soundObj.SOUND_CRASH.play();
  globals.soundObj.SOUND_SUSUME_END.play({ interrupt: "late", volume: 0.6 });

  to(GameOverEngine, {
    passCarCount: passCarCount
  });
}

export default new GameEngine();
