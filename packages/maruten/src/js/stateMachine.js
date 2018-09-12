import State from "./state.js";
import Util from "./util.js";
import Tick from "./tick.js";

import TopEngine from "./engine/top-engine.js";
import PreloadEngine from "./engine/preload-engine.js";
import GameEngine from "./engine/game-engine.js";
import GameoverEngine from "./engine/gameover-engine.js";
import MenuEngine from "./engine/menu-engine.js";
import HowToPlayEngine from "./engine/howToPlay-engine.js";
import CreditEngine from "./engine/credit-engine.js";

/* シングルトン */
let _instance = null;

export default class StateMachine {
  constructor() {
    /* new からのインスタンス作成禁止 */
    if (_instance !== null) {
      throw new Error("SingleTon.instance()してね");
    }

    /* 初回のインスタンス作成時 */
    if (_instance === null) {
      _instance = this;

      this.tick = new Tick();
    }

    return _instance;
  }

  static instance() {
    if (_instance === null) {
      _instance = new StateMachine();
    }
    return _instance;
  }

  /*************************************
   * ロード画面
   */
  preloadState() {
    new PreloadEngine(StateMachine.instance()).start();
  }

  /*************************************
   * TOP画面
   */
  topState() {
    Util.removeAllChildren();
    new TopEngine(() => {
      StateMachine.instance().menuState();
    }).start();
  }

  /*************************************
   * MENU画面
   */
  menuState() {
    Util.removeAllChildren();
    new MenuEngine(StateMachine.instance()).start();
  }

  /*************************************
   * クレジット画面
   */
  creditState() {
    State.gameStage.removeAllChildren();
    new CreditEngine(() => {
      StateMachine.instance().menuState();
    }).start();
  }

  /*************************************
   * 操作説明画面
   */
  howToPlayState() {
    Util.removeAllChildren();
    new HowToPlayEngine(this.tick, () => {
      StateMachine.instance().menuState();
    }).start();
  }

  /*************************************
   * ゲーム画面
   */
  gameState() {
    Util.removeAllChildren();
    new GameEngine(this.tick, () => {
      StateMachine.instance().gameOverState();
    }).start();
  }

  /*************************************
   * GAMEOVER画面
   */
  gameOverState() {
    Util.removeAllChildren();
    new GameoverEngine(
      this.tick,
      () => {
        StateMachine.instance().menuState();
      },
      () => {
        StateMachine.instance().gameState();
      }
    ).start();
  }
}
