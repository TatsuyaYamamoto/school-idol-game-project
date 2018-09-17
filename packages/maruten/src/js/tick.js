import { FPS } from "./static/config.js";

export default class TickEngine {
  constructor() {
    //ゲーム用タイマーの設定
    createjs.Ticker.framerate = FPS;
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
