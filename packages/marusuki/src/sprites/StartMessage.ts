import * as PIXI from "pixi-v6";

export class StartMessage extends PIXI.Text {
  public constructor() {
    super(`スタート！`);
    this.anchor.set(0.5);
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}
