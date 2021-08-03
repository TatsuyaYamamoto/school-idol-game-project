import * as PIXI from "pixi-v6";

import { ViewState } from "../ViewState";

export class TitleState extends ViewState {
  private container!: PIXI.Container;

  onEnter(): void {
    const { app } = this.context;
    this.container = new PIXI.Container();
    const hitArea = new PIXI.Rectangle();
    hitArea.width = app.width;
    hitArea.height = app.height;
    this.container.hitArea = hitArea;
    app.stage.addChild(this.container);

    const titleText = new PIXI.Text("まるすき");
    titleText.anchor.set(0.5);
    titleText.scale.set(app.scale);
    titleText.x = app.getX(0.5);
    titleText.y = app.getY(0.3);
    this.container.addChild(titleText);

    const loadingProgressText = new PIXI.Text("タップではじまるよ！");
    loadingProgressText.anchor.set(0.5);
    loadingProgressText.scale.set(app.scale);
    loadingProgressText.x = app.getX(0.5);
    loadingProgressText.y = app.getY(0.8);
    this.container.addChild(loadingProgressText);

    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on("pointerdown", this.onTapForStart);
  }

  onExit(): void {
    const { app } = this.context;
    app.stage.removeChild(this.container);
  }

  onTapForStart = (): void => {
    // 特定の？Android端末onceが発火しない...
    this.container.off("pointerdown", this.onTapForStart);
    this.sendEvent({ type: "START_GAME" });
  };
}
