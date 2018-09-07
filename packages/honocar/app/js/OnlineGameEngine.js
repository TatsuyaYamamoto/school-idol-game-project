import Player from "./character/Player";
import Car from "./character/Car";
import { onlineGameOverState } from "./stateMachine";
import globals from "./globals";
import { text_game_count_L, text_game_count_R } from "./resources/text";
import properties from "./resources/object-props";
import config from "./resources/config";
import { P2PClient, getLogger } from "@sokontokoro/mikan";
import { P2PEvents } from "./constants";

const logger = getLogger("online-game-engine");
let cars = [];
let shouldPushCar = false;
let playerCrashedTime = null;
let opponentCrashTime = null;
let isMatched = false;

//ゲーム初期化-----------------------------------------
export function init() {
  //honoka or erichiを作成
  //初期値はplayCharacter=honoka
  globals.player = new Player(globals.playCharacter);

  const opponentCharacter =
    globals.playCharacter === "honoka" ? "erichi" : "honoka";
  globals.opponent = new Player(opponentCharacter);

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
  playerCrashedTime = null;
  opponentCrashTime = null;
  shouldPushCar = P2PClient.get().peerId < P2PClient.get().remotePeerId;
  isMatched = false;
}

function keyDownEvent(event) {
  const { imageObj } = globals;
  if (event.which == 37 && imageObj.BUTTON_LEFT_ONLINE.mouseEnabled) {
    clickButtonLeft();
  }
  if (event.keyCode == 39 && imageObj.BUTTON_RIGHT_ONLINE.mouseEnabled) {
    clickButtonRight();
  }
}

// ゲームスタートカウント-----------------------------------------
function gameReady() {
  const { gameStage, soundObj, imageObj, textObj, player, opponent } = globals;
  globals.gameFrame++;

  switch (globals.gameFrame) {
    case 1:
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(opponent.img);
      gameStage.addChild(player.img);
      gameStage.update();
      break;
    case 10:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-2-";
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(opponent.img);
      gameStage.addChild(player.img);
      gameStage.update();
      break;
    case 30:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-1-";
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(opponent.img);
      gameStage.addChild(player.img);
      gameStage.update();
      break;
    case 50:
      soundObj.SOUND_PI2.play();
      gameStage.removeAllChildren();
      gameStatusReset();
      drawGameScrean();
      createjs.Ticker.removeEventListener("tick", globals.tickListener);

      P2PClient.get().on(P2PClient.EVENTS.DATA, onDataReceived);

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

  if (shouldPushCar && globals.gameFrame % 20 === 0) {
    enemyAppeare();
  }

  if (!isPlayerCrashed()) {
    cars.forEach(function(target, index) {
      if (target.passed) {
        cars.splice(index, 1);
        globals.passCarCount++;
      }

      if (player.lane === target.lane && checkDistance(target) < 0) {
        crash();
      }
    });
  }
}

// 描画処理-----------------------------------------
function drawGameScrean() {
  const { gameStage, imageObj, textObj, player, opponent } = globals;

  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.BUTTON_LEFT_ONLINE);
  gameStage.addChild(imageObj.BUTTON_RIGHT_ONLINE);
  gameStage.addChild(textObj.TEXT_GAME_COUNT);
  gameStage.addChild(opponent.img);
  gameStage.addChild(player.img);
}

// 敵出現---------------------------------------
function enemyAppeare() {
  shouldPushCar = false;
  const enemyNumber = Math.floor(Math.random() * 5);

  logger.debug(`push car. car index: ${enemyNumber}`);

  sendPushCarEvent(enemyNumber);
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

// 操作ボタンの状態操作系---------------------------

// ボタン状態の確認
function checkButton() {
  const { player } = globals;

  if (player.lane === 0) {
    leftButtonDisable();
  }
  if (player.lane === 1) {
    leftButtonEnable();
  }
  if (player.lane === 2) {
    rightButtonEnable();
  }
  if (player.lane === 3) {
    rightButtonDisable();
  }
}

// 有効化
function rightButtonEnable() {
  globals.imageObj.BUTTON_RIGHT_ONLINE.mouseEnabled = true;
  globals.imageObj.BUTTON_RIGHT_ONLINE.alpha = 0.5;
}
function leftButtonEnable() {
  globals.imageObj.BUTTON_LEFT_ONLINE.mouseEnabled = true;
  globals.imageObj.BUTTON_LEFT_ONLINE.alpha = 0.5;
}

// 無効化
function rightButtonDisable() {
  globals.imageObj.BUTTON_RIGHT_ONLINE.mouseEnabled = false;
  globals.imageObj.BUTTON_RIGHT_ONLINE.alpha = 0.2;
}
function leftButtonDisable() {
  globals.imageObj.BUTTON_LEFT_ONLINE.mouseEnabled = false;
  globals.imageObj.BUTTON_LEFT_ONLINE.alpha = 0.2;
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

  sendChangeLaneEvent();

  checkButton();
}

// TODO: remove export.
export function clickButtonLeft() {
  globals.player.lane--;
  globals.player.moveLeft();
  globals.soundObj.SOUND_KAIHI.play();

  sendChangeLaneEvent();

  checkButton();
}
// クラッシュ関数-------------------------------------
function isPlayerCrashed() {
  return !!playerCrashedTime;
}

function isOpponentCrashed() {
  return !!opponentCrashTime;
}

function crash() {
  playerCrashedTime = Date.now();
  let waitTime = P2PClient.get().averagePing * 10;
  if (1000 < waitTime) {
    waitTime = 1000;
  }

  logger.debug(
    `player is crash at ${playerCrashedTime} ms ${
      globals.gameFrame
    } frames. Wait for ${waitTime}ms to check opponent is crashed at the same time.`
  );

  sendCrashEvent(playerCrashedTime);

  setTimeout(judge, waitTime);
}

function judge() {
  if (isMatched) {
    logger.debug("This game is already matched. ignore judge request.");
    return;
  }
  isMatched = true;

  const pTime = playerCrashedTime;
  const oTime = opponentCrashTime;

  let result = "draw";

  if (isPlayerCrashed() && !isOpponentCrashed()) {
    result = "lose";
  }

  if (!isPlayerCrashed() && isOpponentCrashed()) {
    result = "win";
  }

  if (isPlayerCrashed() && isOpponentCrashed()) {
    result = pTime === oTime ? "draw" : oTime < pTime ? "win" : "lose";
  }

  logger.debug(
    `judge. game is ${result}.  player crash time: ${pTime}, opponent: ${oTime}, player - opponent = ${pTime -
      oTime}ms`
  );

  globals.textObj.TEXT_GAME_COUNT.text =
    text_game_count_L + globals.passCarCount + text_game_count_R;
  globals.soundObj.SOUND_SUSUME_LOOP.stop();
  globals.soundObj.SOUND_CRASH.play();
  globals.soundObj.SOUND_SUSUME_END.play({
    interrupt: "late",
    volume: 0.6
  });

  // createjs.Ticker.reset();
  createjs.Ticker.removeEventListener("tick", globals.tickListener);

  //キーボード用keycodeevent削除
  window.removeEventListener("keydown", keyDownEvent);

  P2PClient.get().off(P2PClient.EVENTS.DATA, onDataReceived);

  //stateマシン内、ゲームオーバー状態に遷移
  onlineGameOverState(result);
}

function onDataReceived(data) {
  const { opponent } = globals;
  const { message, time } = data;

  const f = {};
  f[P2PEvents.CHANGE_LANE] = function() {
    const nextLane = message.detail.lane;
    const prevLane = opponent.lane;

    opponent.lane = nextLane;

    if (prevLane < nextLane) {
      opponent.moveRight();
    } else if (nextLane < prevLane) {
      opponent.moveLeft();
    } else {
      // nextLane === nextLane
      // ignore
    }
  };

  f[P2PEvents.PUSH_CAR] = function() {
    const nextPusher = message.detail.nextPusher;
    if (nextPusher === P2PClient.get().peerId) {
      shouldPushCar = true;
      globals.gameFrame = globals.gameFrame - (globals.gameFrame % 20) + 20;
    }

    const nextEnemyNumber = message.detail.nextEnemyNumber;
    pushCar(nextEnemyNumber);
  };

  f[P2PEvents.CRASHED] = function() {
    opponentCrashTime = message.detail.crashedAt;
    logger.debug(`opponent is crash at ${opponentCrashTime}ms.`);
    judge();
  };

  f[message.type] && f[message.type]();
}

function sendChangeLaneEvent() {
  const message = {
    type: P2PEvents.CHANGE_LANE,
    detail: {
      lane: globals.player.lane
    }
  };

  P2PClient.get().send(message);
}

function sendPushCarEvent(enemyNumber) {
  const message = {
    type: P2PEvents.PUSH_CAR,
    detail: {
      nextEnemyNumber: enemyNumber,
      nextPusher: P2PClient.get().remotePeerId
    }
  };

  P2PClient.get().send(message);
}

function sendCrashEvent(crashedTime) {
  const message = {
    type: P2PEvents.CRASHED,
    detail: {
      crashedAt: crashedTime
    }
  };

  P2PClient.get().send(message);
}
