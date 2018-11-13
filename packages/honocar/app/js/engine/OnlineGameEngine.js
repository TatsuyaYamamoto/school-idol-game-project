import {
  getLogger,
  tracePage,
  SkyWayEvents,
  t,
  getRandomInteger,
  NtpDate,
  LimitedArray,
  mean
} from "@sokontokoro/mikan";

import Player from "../character/Player";
import Car from "../character/Car";

import Engine from "./Engine";
import { checkDistance } from "./GameEngine";
import OnlineGameOverEngine from "./OnlineGameOverEngine";
import { to } from "../stateMachine";

import globals from "../globals";
import { P2PEvents } from "../constants";
import { getClient as getSkyWayClient, wait } from "../common";

import { TRACK_PAGES } from "../resources/config";
import { Ids } from "../resources/string";

const MAX_WAIT_TIME = 150;
const PUSH_CAR_FRAME_UNIT = 19; // single modeでは20frame毎に車が出現するが、通信時間を考慮してframe数を小さくする
const logger = getLogger("online-game-engine");
let cars = [];
let shouldPushCarFrame = null;
let playerCrashedTime = null;
let opponentCrashTime = null;
let isMatched = false;
let gameFrame = 0;
let passCarCount = 0;

const deltaTimes = new LimitedArray(5);
window.__debug__ = {
  fps: 0,
  ignoreCrash: false
};

class OnlineGameEngine extends Engine {
  init() {
    super.init();

    tracePage(TRACK_PAGES.GAME_ONLINE);

    const { imageObj, soundObj } = globals;

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

    createjs.Ticker.addEventListener("tick", processStage);
    window.addEventListener("keydown", keyDownEvent);

    getSkyWayClient().on(SkyWayEvents.DATA, onDataReceived);

    gameReady().then(() => {
      createjs.Ticker.addEventListener("tick", processGame);

      soundObj.SOUND_SUSUME_LOOP.play({
        interrupt: "late",
        loop: -1,
        volume: 0.6
      });
    });
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

    createjs.Ticker.removeEventListener("tick", processStage);
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
  isMatched = false;

  const isFirstPushUser = getSkyWayClient().isRoomOwner;
  shouldPushCarFrame = isFirstPushUser ? PUSH_CAR_FRAME_UNIT : null;
}

function processStage() {
  globals.gameStage.update();
}

// ゲームスタートカウント-----------------------------------------

async function gameReady() {
  const { gameStage, soundObj, imageObj, textObj, player, opponent } = globals;

  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(opponent.img);
  gameStage.addChild(player.img);

  await wait(500);
  soundObj.SOUND_PI1.play();
  textObj.TETX_GAMESTART_COUNT.text = "-2-";
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
  gameStage.addChild(opponent.img);
  gameStage.addChild(player.img);

  await wait(1000);
  soundObj.SOUND_PI1.play();
  textObj.TETX_GAMESTART_COUNT.text = "-1-";
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
  gameStage.addChild(opponent.img);
  gameStage.addChild(player.img);

  await wait(1000);

  soundObj.SOUND_PI2.play();
  gameStage.removeAllChildren();
  gameStatusReset();
  drawGameScrean();
}

// ゲーム処理-----------------------------------------
function processGame({ delta }) {
  deltaTimes.push(delta);
  window.__debug__.fps = mean(deltaTimes.getAll());

  const { player } = globals;

  gameFrame++;

  globals.textObj.TEXT_GAME_COUNT.text = passCountText();

  if (gameFrame === shouldPushCarFrame) {
    enemyAppeare();
  }

  if (!isPlayerCrashed()) {
    cars.forEach(function(target, index) {
      if (target.passed) {
        cars.splice(index, 1);
        passCarCount++;
      }

      if (player.lane === target.lane && checkDistance(target) < 0) {
        if (!window.__debug__.ignoreCrash) {
          crash();
        }
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

/**
 * Carを出現させる。
 *
 * 0-5の整数の乱数を取得して、次の出現するCarのlaneを決定する
 * 　0-3: 0-3のlaneにcarを出現させる
 * 　4　: playerのlaneと同じ
 * 　5　: なにも起きない
 */
function enemyAppeare() {
  logger.debug(`start push car logic. frame: ${gameFrame}`);

  shouldPushCarFrame = null;

  const nextCarIndex = getRandomInteger(0, 5);
  const enemyNumber = nextCarIndex === 4 ? globals.player.lane : nextCarIndex;
  const pushTime = NtpDate.now() + 100;

  sendPushCarEvent(enemyNumber, pushTime);
  pushCar(enemyNumber, pushTime);
}

function pushCar(laneIndex, pushTime) {
  const now = NtpDate.now();
  const pushTimeOffset = now < pushTime ? pushTime - now : 0;

  logger.debug(
    `push car. lane index: ${laneIndex}, pushTimeOffset: ${pushTimeOffset}`
  );

  setTimeout(() => {
    if (isMatched) {
      logger.debug(
        "this game is already matched. ignore delayed push car event."
      );
      return;
    }

    switch (laneIndex) {
      case 0:
      case 1:
      case 2:
      case 3:
        cars.push(new Car(laneIndex));
        break;
      default:
        // なにもおきない
        break;
    }
  }, pushTimeOffset);
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
  const now = NtpDate.now();
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
  const { nextPusher, pushTime, nextEnemyNumber } = message.detail;
  if (nextPusher === getSkyWayClient().peerId) {
    shouldPushCarFrame = gameFrame + PUSH_CAR_FRAME_UNIT;

    pushCar(nextEnemyNumber, pushTime);
  }
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

function sendPushCarEvent(enemyNumber, pushTime) {
  const message = {
    type: P2PEvents.PUSH_CAR,
    detail: {
      nextEnemyNumber: enemyNumber,
      nextPusher: getSkyWayClient().remotePeerIds[0],
      pushTime
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
  const now = NtpDate.now();
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
