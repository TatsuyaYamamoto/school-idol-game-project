import * as PIXI from "pixi-v6";

export class TakoDownloadIndicator extends PIXI.Text {
  private icon = "🐙";

  public constructor() {
    super("");
    this.anchor.set(0.5);
  }

  public update(progress: number) {
    // 10の桁で四捨五入
    const number = Math.round(progress / 10);
    console.log(number);
    this.text = [...Array(number)].map(() => this.icon).join("");
  }
}
