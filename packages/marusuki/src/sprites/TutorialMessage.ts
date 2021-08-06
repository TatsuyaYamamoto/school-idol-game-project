import * as PIXI from "pixi-v6";

export class TutorialMessage extends PIXI.Text {
  public constructor() {
    super(`リズムに乗って "まんまる" をタップ！`);
    this.anchor.set(0.5);
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}
