import State from "../state.js";
import {
  GAME_TIME_LENGTH_SECONDS,
  ADD_TIME_SECONDS_BY_ITEM
} from "../static/config.js";
import { CHARACTER } from "../static/constant.js";
import Util from "../util.js";
import Player from "../character/player.js";
import Enemy from "../character/enemy.js";
import Item from "../character/item.js";
import Feather from "../character/feather.js";
import ThrowAction from "./throwAction.js";
import Timer from "../timer.js";

export default class GameEngine {
  constructor(tick, callbackState) {
    this.tick = tick;
    this.callbackState = callbackState;

    this.datenCount = 0; // ゲームの得点
    this.gameFrame = 0; // フレームカウント
    this.throwAction = null; // 羽を投げる状態の管理オブジェクト

    this.player = new Player();

    this.enemy = null; // よしこ
    this.addTimeItem = null; // タイマー加算アイテム
    this.feathers = []; // 黒き羽

    this.frameOfAppearingAddTimeItem = 0; // タイマー加算アイテムが次に出現するフレーム数
    this.frameOfDisappearingAddTimeItem = 0; // タイマー加算アイテムが消滅するフレーム数

    this.timer = new Timer(GAME_TIME_LENGTH_SECONDS, () => {
      this.finish();
    });

    this.touchEvent = this.touchEvent.bind(this);
  }

  //ゲーム初期化-----------------------------------------
  start() {
    Util.removeAllChildren();
    Util.addChildren([
      State.object.image.BACKGROUND,
      State.object.text.GAMESTART_COUNT,
      this.player.img
    ]);

    // ゲームスタートカウントスタート
    this.tick.add(() => {
      this.countdown();
    });
  }

  // 開始カウントダウン-----------------------------------------
  countdown() {
    this.gameFrame++;

    switch (this.gameFrame) {
      case 10:
        State.object.sound.PI1.play();
        State.object.text.GAMESTART_COUNT.text = "-2-";
        State.gameStage.update();
        break;
      case 30:
        State.object.sound.PI1.play();
        State.object.text.GAMESTART_COUNT.text = "-1-";
        State.gameStage.update();
        break;

      case 50:
        State.object.sound.PI2.play();
        Util.removeAllChildren();

        this.handleTouchEventListener().add();

        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            Util.addChildren(
              [
                State.object.image.BACKGROUND,
                this.player.img,
                State.object.text.SCORE_COUNT,
                State.object.image.COUNT_YOSHIKO
              ].concat(this.timer.getElementArray())
            );
            break;
          case CHARACTER.YOU:
            Util.addChildren(
              [
                State.object.image.BACKGROUND,
                this.player.img,
                State.object.text.SCORE_COUNT,
                State.object.image.COUNT_RIKO
              ].concat(this.timer.getElementArray())
            );
            break;
        }

        this.tick.remove();

        this.timer.start();
        // ゲームメインプロセス開始
        this.tick.add(() => {
          this.process();
        });

        // 最初のオブジェクト出現の定義
        this.appearYoshiko();
        this.frameOfAppearingAddTimeItem = Util.getRondom(100, 200);

        State.object.sound.GAME_LOOP.play({ loop: -1, volume: 0.4 });

        break;
    }
  }

  /***************************************
   * ゲームメインプロセス
   */
  process() {
    this.gameFrame++;
    State.object.text.SCORE_COUNT.text = `×${this.datenCount}`;

    // 当たり判定チェック
    this.checkHit();

    // 加算アイテム出現
    if (this.frameOfAppearingAddTimeItem == this.gameFrame) {
      this.appearAddTimeItem();
    }

    // 加算アイテム消滅
    if (
      this.addTimeItem != null &&
      this.frameOfDisappearingAddTimeItem == this.gameFrame
    ) {
      this.disappearAddTimeItem();
    }

    // 再描画
    State.gameStage.update();
  }

  /**
   * 羽と画面内オブジェクトの当たり判定チェック
   */
  checkHit() {
    this.feathers.forEach(feather => {
      // よしこ
      if (this.enemy != null && this.enemy.doseColideWithFeather(feather)) {
        this.enemy.hit();

        State.object.sound.DATEN.stop();
        State.object.sound.DATEN.play();

        this.datenCount++;
        this.enemy = null;

        this.appearYoshiko();
      }
      // 加点アイテム
      if (
        this.addTimeItem != null &&
        this.addTimeItem.doseColideWithFeather(feather)
      ) {
        this.disappearAddTimeItem();

        State.object.sound.MICAN.stop();
        State.object.sound.MICAN.play();

        this.timer.addCount(ADD_TIME_SECONDS_BY_ITEM);
      }
    });
  }

  /****************************************
   * オブジェクト出現、消滅処理
   */
  appearYoshiko() {
    let newYoshiko = new Enemy(
      (State.gameScrean.width / 10) * Util.getRondom(1, 9),
      (State.gameScrean.height / 10) * Util.getRondom(1, 5)
    );
    State.gameStage.addChild(newYoshiko.img);

    this.enemy = newYoshiko;
  }

  appearAddTimeItem() {
    let item = new Item(
      (State.gameScrean.width / 10) * Util.getRondom(1, 9),
      (State.gameScrean.height / 10) * Util.getRondom(1, 5)
    );
    State.gameStage.addChild(item.img);

    this.addTimeItem = item;

    this.frameOfDisappearingAddTimeItem = this.gameFrame + 40;
  }

  disappearAddTimeItem() {
    this.addTimeItem.hit();
    this.addTimeItem = null;

    this.frameOfAppearingAddTimeItem = this.gameFrame + Util.getRondom(80, 150);
  }

  /*******************************
   * ゲーム終了
   */
  finish() {
    // 得点登録
    State.gameScore = this.datenCount;

    // イベント削除
    this.tick.remove();
    this.handleTouchEventListener().remove();

    State.gameStage.update();

    State.object.sound.GAME_LOOP.stop();
    State.object.sound.GAME_END.play({ volume: 0.4 });

    this.callbackState();
  }

  /************************************
   * タッチイベント
   * @returns {{add: (function()), remove: (function())}}
   */
  handleTouchEventListener() {
    return {
      add: () => {
        State.gameStage.addEventListener("pressup", this.touchEvent);
        State.gameStage.addEventListener("mousedown", this.touchEvent);
      },
      remove: () => {
        State.gameStage.removeEventListener("pressup", this.touchEvent);
        State.gameStage.removeEventListener("mousedown", this.touchEvent);
      }
    };
  }

  touchEvent(event) {
    switch (event.type) {
      case "mousedown":
        this.throwAction = new ThrowAction();
        this.throwAction.startX = event.stageX;
        this.throwAction.startY = event.stageY;

        this.player.prepareThrow();
        break;

      case "pressup":
        if (this.throwAction == null) {
          break;
        }
        this.throwAction.endX = event.stageX;
        this.throwAction.endY = event.stageY;

        this.throwFeather(this.throwAction.getAngle());
        this.throwAction = null;
        break;
    }
  }

  /**
   * 羽をよしこに投げる
   * Featherインスタンスを作成し、アニメーションを実行する
   *
   * @param radian 投げる角度
   */
  throwFeather(radian) {
    // 画面上方向の角度の場合はねを投げるモーションへ移行
    if (radian < 0) {
      let feather = new Feather();
      this.feathers.push(feather);
      State.gameStage.addChildAt(
        feather.img,
        State.gameStage.getChildIndex(this.player.img)
      );
      feather.move(radian, () => {
        // 羽の移動アニメ終了後に、配列から削除
        this.feathers.shift();
      });

      this.player.throw();

      State.object.sound.THROW.stop();
      State.object.sound.THROW.play();
    } else {
      // 画面下方向の角度の場合、待機モーションに移行して終了
      this.player.wait();
    }
  }
}
