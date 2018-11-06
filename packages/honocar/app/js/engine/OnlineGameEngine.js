import { getLogger, tracePage, SkyWayEvents, t } from "@sokontokoro/mikan";

import Player from "../character/Player";
import Car from "../character/Car";

import Engine from "./Engine";
import { checkDistance } from "./GameEngine";
import OnlineGameOverEngine from "./OnlineGameOverEngine";
import { to } from "../stateMachine";

import globals from "../globals";
import { P2PEvents } from "../constants";
import { getClient as getSkyWayClient } from "../common";

import { TRACK_PAGES } from "../resources/config";
import { Ids } from "../resources/string";

const MAX_WAIT_TIME = 150;
const logger = getLogger("online-game-engine");
let cars = [];
let shouldPushCar = false;
let playerCrashedTime = null;
let opponentCrashTime = null;
let isMatched = false;
let gameFrame = 0;
let passCarCount = 0;

class OnlineGameEngine extends Engine {
  init() {
    super.init();

    tracePage(TRACK_PAGES.GAME_ONLINE);

    const { imageObj } = globals;

    //honoka or eriを作成
    //初期値はplayCharacter=honoka
    globals.player = new Player(globals.playCharacter);

    const opponentCharacter =
      globals.playCharacter === "honoka" ? "eri" : "honoka";
    globals.opponent = new Player(opponentCharacter);
    globals.opponent.img.alpha = 0.5;

    //フレーム数リセット
    gameStatusReset();

    //ボタン有効化
    checkButton();

    imageObj.BUTTON_RIGHT_ONLINE.addEventListener(
      "mousedown",
      clickButtonRight
    );
    imageObj.BUTTON_LEFT_ONLINE.addEventListener("mousedown", clickButtonLeft);

    createjs.Ticker.addEventListener("tick", gameReady);
    window.addEventListener("keydown", keyDownEvent);

    getSkyWayClient().on(SkyWayEvents.DATA, onDataReceived);
  }

  tearDown() {
    super.tearDown();
    const { imageObj } = globals;

    imageObj.BUTTON_RIGHT_ONLINE.removeEventListener(
      "mousedown",
      clickButtonRight
    );
    imageObj.BUTTON_LEFT_ONLINE.removeEventListener(
      "mousedown",
      clickButtonLeft
    );

    createjs.Ticker.removeEventListener("tick", gameReady);
    createjs.Ticker.removeEventListener("tick", processGame);
    window.removeEventListener("keydown", keyDownEvent);

    getSkyWayClient().off(SkyWayEvents.DATA, onDataReceived);
  }
}

function gameStatusReset() {
  gameFrame = 0;
  passCarCount = 0;
  cars = [];
  playerCrashedTime = null;
  opponentCrashTime = null;
  shouldPushCar = getSkyWayClient().isRoomOwner;
  isMatched = false;
}

// ゲームスタートカウント-----------------------------------------
function gameReady() {
  const { gameStage, soundObj, imageObj, textObj, player, opponent } = globals;
  gameFrame++;

  switch (gameFrame) {
    case 1:
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(opponent.img);
      gameStage.addChild(player.img);
      break;
    case 10:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-2-";
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(opponent.img);
      gameStage.addChild(player.img);
      break;
    case 30:
      soundObj.SOUND_PI1.play();
      textObj.TETX_GAMESTART_COUNT.text = "-1-";
      gameStage.addChild(imageObj.GAME_BACKGROUND);
      gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
      gameStage.addChild(opponent.img);
      gameStage.addChild(player.img);
      break;
    case 50:
      soundObj.SOUND_PI2.play();
      gameStage.removeAllChildren();
      gameStatusReset();
      drawGameScrean();

      //ゲーム処理開始
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

  globals.textObj.TEXT_GAME_COUNT.text = passCountText();
  gameStage.update();

  if (shouldPushCar && gameFrame % 20 === 0) {
    enemyAppeare();
  }

  if (!isPlayerCrashed()) {
    cars.forEach(function(target, index) {
      if (target.passed) {
        cars.splice(index, 1);
        passCarCount++;
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

  sendPushCarEvent(enemyNumber);

  logger.debug(`push car. car index: ${enemyNumber}, now: ${Date.now()}`);
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

// イベント処理-------------------------------------
function keyDownEvent(event) {
  const { imageObj } = globals;
  if (event.which === 37 && imageObj.BUTTON_LEFT_ONLINE.mouseEnabled) {
    clickButtonLeft();
  }
  if (event.keyCode === 39 && imageObj.BUTTON_RIGHT_ONLINE.mouseEnabled) {
    clickButtonRight();
  }
}

function clickButtonRight() {
  globals.player.lane++;
  globals.player.moveRight();

  // TODO reconsider how to set interrupt
  globals.soundObj.SOUND_KAIHI.stop();
  globals.soundObj.SOUND_KAIHI.play();

  sendChangeLaneEvent();

  checkButton();
}

function clickButtonLeft() {
  globals.player.lane--;
  globals.player.moveLeft();

  // TODO reconsider how to set interrupt
  globals.soundObj.SOUND_KAIHI.stop();
  globals.soundObj.SOUND_KAIHI.play();

  sendChangeLaneEvent();

  checkButton();
}

// ボタン状態の確認
function checkButton() {
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

// クラッシュ関数-------------------------------------
function isPlayerCrashed() {
  return !!playerCrashedTime;
}

function isOpponentCrashed() {
  return !!opponentCrashTime;
}

function crash() {
  const now = Date.now();
  playerCrashedTime = now;

  const waitInterval = getWaitInterval();
  const judgeTime = now + waitInterval;

  logger.debug(
    `player is crashed at ${playerCrashedTime} ms, ${gameFrame} frames.`
  );
  logger.debug(
    `Wait for ${waitInterval}ms to check opponent is crashed at the same time.`
  );

  const fps = createjs.Ticker.framerate;

  sendCrashEvent(playerCrashedTime, judgeTime);

  setTimeout(() => {
    judge(1000 / fps);
  }, waitInterval);
}

function judge(allowableTimeDiff) {
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
    const timeDiff = pTime - oTime;

    if (-1 * allowableTimeDiff < timeDiff || timeDiff < allowableTimeDiff) {
      result = "draw";
    } else {
      result = oTime < pTime ? "win" : "lose";
    }
  }

  logger.debug(
    `judge. game is ${result}.  player crash time: ${pTime}, opponent: ${oTime}, player - opponent = ${pTime -
      oTime}ms`
  );

  goGameOverState(result);
}

function onDataReceived(data) {
  const { message, time } = data;

  const f = {
    [P2PEvents.CHANGE_LANE]: onOpponentChangedLane,
    [P2PEvents.PUSH_CAR]: onOpponentPushedCar,
    [P2PEvents.CRASHED]: onOpponentCrashed
  };

  f[message.type] && f[message.type](message);
}

function onOpponentChangedLane(message) {
  const { opponent } = globals;
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
}

function onOpponentPushedCar(message) {
  const nextPusher = message.detail.nextPusher;
  if (nextPusher === getSkyWayClient().peerId) {
    shouldPushCar = true;
    gameFrame = gameFrame - (gameFrame % 20) + 20;
  }

  const nextEnemyNumber = message.detail.nextEnemyNumber;
  pushCar(nextEnemyNumber);
}

function onOpponentCrashed(message) {
  opponentCrashTime = message.detail.crashedTime;
  const judgeTime = message.detail.judgeTime;
  const fps = message.detail.fps;
  const waitInterval = getWaitIntervalBy(judgeTime);

  logger.debug(
    `opponent is crashed at ${opponentCrashTime}ms. wait for judge; ${waitInterval} ms`
  );

  setTimeout(() => {
    judge(1000 / fps);
  }, waitInterval);
}

function sendChangeLaneEvent() {
  const message = {
    type: P2PEvents.CHANGE_LANE,
    detail: {
      lane: globals.player.lane
    }
  };

  getSkyWayClient().send(message);
}

function sendPushCarEvent(enemyNumber) {
  const message = {
    type: P2PEvents.PUSH_CAR,
    detail: {
      nextEnemyNumber: enemyNumber,
      nextPusher: getSkyWayClient().remotePeerIds[0]
    }
  };

  getSkyWayClient().send(message);
}

function sendCrashEvent(crashedTime, judgeTime, fps) {
  const message = {
    type: P2PEvents.CRASHED,
    detail: {
      crashedTime: crashedTime,
      judgeTime: judgeTime,
      fps: fps
    }
  };

  getSkyWayClient().send(message);
}

function getWaitInterval() {
  const ping = getSkyWayClient().averagePings[0];
  const secondPerFrame = 1000 / createjs.Ticker.framerate;

  const waitInterval = secondPerFrame + ping * 4;

  return waitInterval < MAX_WAIT_TIME ? waitInterval : MAX_WAIT_TIME;
}

function getWaitIntervalBy(judgeTime) {
  const now = Date.now();
  return now < judgeTime ? judgeTime - now : 0;
}

function goGameOverState(result) {
  globals.textObj.TEXT_GAME_COUNT.text = passCountText();
  globals.soundObj.SOUND_SUSUME_LOOP.stop();
  globals.soundObj.SOUND_CRASH.play();
  globals.soundObj.SOUND_SUSUME_END.play({
    interrupt: "late",
    volume: 0.6
  });

  //stateマシン内、ゲームオーバー状態に遷移
  to(OnlineGameOverEngine, { result: result, passCarCount });
}

function passCountText() {
  return t(Ids.PASS_COUNT, { count: passCarCount });
}

export default new OnlineGameEngine();
