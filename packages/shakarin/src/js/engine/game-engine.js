import { tracePage } from "@sokontokoro/mikan";

import State from "../state.js";
import Util from "../util.js";
import Player from "../player.js";

import { config } from "../config.js";
import { TRACK_PAGES } from "../config";

export default class GameEngine {
  constructor(tick, callbackState) {
    this.tick = tick;
    this.callbackState = callbackState;

    this.shakeCount = 0;
    this.gameFrame = 0;
    this.nextCheckFrame = config.system.firstCheckFrame;
    this.player = new Player(State.playCharacter);

    this.keyDownEvent = this.keyDownEvent.bind(this);
  }

  countUp() {
    this.shakeCount++;
  }

  //ゲーム初期化-----------------------------------------
  start() {
    tracePage(TRACK_PAGES.GAME);

    this.allButtonDisable();
    this.handleButtonEventListener().add();
    this.handleKeyDownEventListener().add();

    // ゲームスタートカウントスタート
    this.tick.add(() => {
      this.gameReady();
    });
  }

  gameReady() {
    this.gameFrame++;

    switch (this.gameFrame) {
      case 1:
        State.object.text.GAMESTART_COUNT.text = "";
        // Util.addChildren([
        // 	_imageObj.BACKGROUND,
        // 	_player.img
        // ]);
        State.gameStage.update();
        break;
      case 10:
        State.object.sound.PI1.stop();
        State.object.sound.PI1.play();

        State.object.text.GAMESTART_COUNT.text = "-2-";

        Util.removeAllChildren();
        Util.addChildren([
          State.object.image.BACKGROUND,
          State.object.text.GAMESTART_COUNT,
          this.player.img,
        ]);
        State.gameStage.update();
        break;
      case 30:
        State.object.sound.PI1.stop();
        State.object.sound.PI1.play();

        State.object.text.GAMESTART_COUNT.text = "-1-";
        // State.gameStage.addChild(State.object.image.BACKGROUND);
        // State.gameStage.addChild(_textObj.GAMESTART_COUNT);
        // State.gameStage.addChild(_player.img);
        State.gameStage.update();
        break;
      case 50:
        State.object.sound.PI2.stop();
        State.object.sound.PI2.play();

        Util.removeAllChildren();

        this.tick.remove();

        Util.addChildren([
          State.object.image.BACKGROUND,
          State.object.image.RAMEN,
          State.object.image.FLAG_START,
          State.object.image.FLAG_END,
          State.object.image.BUTTON_LEFT,
          State.object.image.BUTTON_RIGHT,
          State.object.image.BUTTON_TOP,
          State.object.image.BUTTON_BOTTOM,
          this.player.img,
          State.object.text.SCORE_COUNT,
        ]);
        // frameを初期化
        this.gameFrame = 0;
        // タイマーアニメーション開始
        this.timerAnimation();
        //ゲーム処理開始
        this.tick.add(() => {
          this.processGame();
        });
        State.object.sound.GAME_LOOP.play({ interrupt: "any" });
        break;
    }
  }

  // ゲーム処理-----------------------------------------
  processGame() {
    this.gameFrame++;
    State.object.text.SCORE_COUNT.text = `${this.shakeCount}しゃか！`;

    if (this.gameFrame === this.nextCheckFrame) {
      this.player.changeDirection();
      this.nextCheckFrame = this.getNextCheckFrame();
      this.updateButtonStatus(this.player.getDirection());
    }
    State.gameStage.update();
  }

  // タイマーアニメーション---------------------------------
  timerAnimation() {
    State.object.image.RAMEN.x = State.gameScrean.width * 0.1;

    createjs.Tween.get(State.object.image.RAMEN)
      .to({ x: State.gameScrean.width * 0.9 }, config.system.timeLength)
      .call(this.finish.bind(this));
  }

  // 敵出現---------------------------------------
  getNextCheckFrame() {
    var i = Math.floor(Math.random() * 30) + 20;
    return this.gameFrame + i;
  }

  /*******************************
   * プレイヤーの方向のボタンを有効化する
   *
   * @param playerDirection
   */
  updateButtonStatus(playerDirection) {
    this.allButtonDisable();

    switch (playerDirection) {
      case "L":
        this.leftButtonEnable();
        break;
      case "R":
        this.rightButtonEnable();
        break;
      case "T":
        this.topButtonEnable();
        break;
      case "B":
        this.bottomButtonEnable();
        break;
    }
  }

  /**************************
   * ボタン有効化
   */
  rightButtonEnable() {
    State.object.image.BUTTON_RIGHT.mouseEnabled = true;
    State.object.image.BUTTON_RIGHT.alpha = 0.7;
  }
  leftButtonEnable() {
    State.object.image.BUTTON_LEFT.mouseEnabled = true;
    State.object.image.BUTTON_LEFT.alpha = 0.7;
  }
  topButtonEnable() {
    State.object.image.BUTTON_TOP.mouseEnabled = true;
    State.object.image.BUTTON_TOP.alpha = 0.7;
  }
  bottomButtonEnable() {
    State.object.image.BUTTON_BOTTOM.mouseEnabled = true;
    State.object.image.BUTTON_BOTTOM.alpha = 0.7;
  }

  /***************************
   * ボタン無効化
   */
  rightButtonDisable() {
    State.object.image.BUTTON_RIGHT.mouseEnabled = false;
    State.object.image.BUTTON_RIGHT.alpha = 0.2;
  }
  leftButtonDisable() {
    State.object.image.BUTTON_LEFT.mouseEnabled = false;
    State.object.image.BUTTON_LEFT.alpha = 0.2;
  }
  topButtonDisable() {
    State.object.image.BUTTON_TOP.mouseEnabled = false;
    State.object.image.BUTTON_TOP.alpha = 0.2;
  }
  downButtonDisable() {
    State.object.image.BUTTON_BOTTOM.mouseEnabled = false;
    State.object.image.BUTTON_BOTTOM.alpha = 0.2;
  }
  allButtonDisable() {
    this.rightButtonDisable();
    this.leftButtonDisable();
    this.topButtonDisable();
    this.downButtonDisable();
  }

  /*******************************
   * ゲーム終了
   */
  finish() {
    // 得点登録
    State.gameScore = this.shakeCount;

    // イベント削除
    createjs.Tween.removeTweens(State.object.image.RAMEN);
    this.handleButtonEventListener().remove();
    this.handleKeyDownEventListener().remove();
    this.tick.remove();

    this.callbackState(this.player);
  }

  /*******************************
   * キーボードイベント
   * @returns {{add: add, remove: remove}}
   */
  handleKeyDownEventListener() {
    return {
      add: () => {
        window.addEventListener("keyup", this.keyDownEvent);
      },
      remove: () => {
        window.removeEventListener("keyup", this.keyDownEvent);
      },
    };
  }

  keyDownEvent(event) {
    if (event.which == 37 && State.object.image.BUTTON_LEFT.mouseEnabled) {
      this.player.shake("L", this.shakeCount);
      this.countUp();
    }
    if (event.keyCode == 39 && State.object.image.BUTTON_RIGHT.mouseEnabled) {
      this.player.shake("R", this.shakeCount);
      this.countUp();
    }
    if (event.keyCode == 38 && State.object.image.BUTTON_TOP.mouseEnabled) {
      this.player.shake("T", this.shakeCount);
      this.countUp();
    }
    if (event.keyCode == 40 && State.object.image.BUTTON_BOTTOM.mouseEnabled) {
      this.player.shake("B", this.shakeCount);
      this.countUp();
    }
  }

  /*******************************
   * キャラクター操作ボタンイベント
   * @returns {{add: add, remove: remove}}
   */
  handleButtonEventListener() {
    const shackLeft = () => {
      this.player.shake("L", this.shakeCount);
      this.countUp();
    };
    const shackRight = () => {
      this.player.shake("R", this.shakeCount);
      this.countUp();
    };
    const shackTop = () => {
      this.player.shake("T", this.shakeCount);
      this.countUp();
    };
    const shackButtom = () => {
      this.player.shake("B", this.shakeCount);
      this.countUp();
    };

    return {
      add: () => {
        State.object.image.BUTTON_LEFT.addEventListener("mousedown", shackLeft);
        State.object.image.BUTTON_RIGHT.addEventListener(
          "mousedown",
          shackRight
        );
        State.object.image.BUTTON_TOP.addEventListener("mousedown", shackTop);
        State.object.image.BUTTON_BOTTOM.addEventListener(
          "mousedown",
          shackButtom
        );
      },
      remove: () => {
        State.object.image.BUTTON_LEFT.removeAllEventListeners("mousedown");
        State.object.image.BUTTON_RIGHT.removeAllEventListeners("mousedown");
        State.object.image.BUTTON_TOP.removeAllEventListeners("mousedown");
        State.object.image.BUTTON_BOTTOM.removeAllEventListeners("mousedown");
      },
    };
  }
}
