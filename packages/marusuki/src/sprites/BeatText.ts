import * as PIXI from "pixi-v6";

export class BeatText extends PIXI.Text {
  public constructor() {
    super("");
    this.anchor.set(0.5);
    this.show(0);
  }

  public show(value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): void {
    const beatNumber = `${value}/8`;
    const { decorationL, decorationR } = ((v: number) => {
      if (v % 4 === 0) {
        return { decorationL: "", decorationR: "" };
      }
      if (v % 2 === 1) {
        return { decorationL: "[ ", decorationR: " ]" };
      }
      return { decorationL: "[ [ ", decorationR: " ] ]" };
    })(value);

    this.text = `${decorationL}${beatNumber}${decorationR}`;
  }
}
