import { config } from "./config.js";

export default class TickEngine {
  constructor() {
    //ゲーム用タイマーの設定
    createjs.Ticker.framerate = config.system.FPS;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

    this.ticker = null;
  }

  add(listener) {
    this.ticker = createjs.Ticker.addEventListener("tick", listener);
  }
  remove() {
    createjs.Ticker.removeEventListener("tick", this.ticker);
    this.ticker = null;
  }
}
