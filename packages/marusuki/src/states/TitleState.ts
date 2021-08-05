import * as PIXI from "pixi-v6";

import { ViewState } from "../ViewState";

export class TitleState extends ViewState {
  private container!: PIXI.Container;

  onEnter(): void {
    const { app } = this.context;
    const { spriteMap } = this.context.machineService.state.context.loader;

    this.container = new PIXI.Container();
    const hitArea = new PIXI.Rectangle();
    hitArea.width = app.width;
    hitArea.height = app.height;
    this.container.hitArea = hitArea;
    app.stage.addChild(this.container);

    const titleSprite = new PIXI.Sprite(
      spriteMap.title.texture as PIXI.Texture
    );
    titleSprite.anchor.set(0.5);
    titleSprite.scale.set(app.scale * 0.6);
    titleSprite.x = app.getX(0.5);
    titleSprite.y = app.getY(0.5);

    const loadingProgressText = new PIXI.Text("タップではじまるよ！");
    loadingProgressText.anchor.set(0.5);
    loadingProgressText.scale.set(app.scale);
    loadingProgressText.x = app.getX(0.5);
    loadingProgressText.y = app.getY(0.9);

    this.container.addChild(titleSprite, loadingProgressText);

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
