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
    if (_instance !== null) {
      throw new Error("SingleTon.instance()してね");
    }
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
    new PreloadEngine(this.tick, () => {
      this.topState();
    }).start();
  }

  /*************************************
   * TOP画面
   */
  topState() {
    Util.removeAllChildren();
    new TopEngine(() => {
      this.menuState();
    }).start();
  }

  /*************************************
   * MENU画面
   */
  menuState() {
    Util.removeAllChildren();
    new MenuEngine(
      this.tick,
      () => {
        this.gameState();
      },
      () => {
        this.howToPlayState();
      },
      () => {
        this.creditState();
      }
    ).start();
  }

  /*************************************
   * クレジット画面
   */
  creditState() {
    State.gameStage.removeAllChildren();
    new CreditEngine(() => {
      this.menuState();
    }).start();
  }

  /*************************************
   * 操作説明画面
   */
  howToPlayState() {
    Util.removeAllChildren();
    new HowToPlayEngine(this.tick, () => {
      this.menuState();
    }).start();
  }

  /*************************************
   * ゲーム画面
   */
  gameState() {
    Util.removeAllChildren();
    new GameEngine(this.tick, player => {
      this.gameOverState(player);
    }).start();
  }

  /*************************************
   * GAMEOVER画面
   */
  gameOverState(player) {
    Util.removeAllChildren();
    new GameoverEngine(
      this.tick,
      player,
      () => {
        this.menuState();
      },
      () => {
        this.gameState();
      }
    ).start();
  }
}
