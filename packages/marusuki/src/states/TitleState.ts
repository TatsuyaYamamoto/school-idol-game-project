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
    titleSprite.scale.set(app.scale);
    titleSprite.x = app.getX(0.5);
    titleSprite.y = app.getY(0.5);

    const iconTwitter = new PIXI.Sprite(
      spriteMap.icon_twitter.texture as PIXI.Texture
    );
    iconTwitter.anchor.set(0.5);
    iconTwitter.scale.set(app.scale * 0.6);
    iconTwitter.x = app.getX(0.8);
    iconTwitter.y = app.getY(0.9);
    iconTwitter.interactive = true;
    iconTwitter.buttonMode = true;
    iconTwitter.on("pointerdown", (e) => {
      e.stopPropagation();
      window.open("https://twitter.com/skntkr_factory");
    });

    const iconHome = new PIXI.Sprite(
      spriteMap.icon_home.texture as PIXI.Texture
    );
    iconHome.anchor.set(0.5);
    iconHome.scale.set(app.scale * 0.6);
    iconHome.x = app.getX(0.93);
    iconHome.y = app.getY(0.9);
    iconHome.interactive = true;
    iconHome.buttonMode = true;
    iconHome.on("pointerdown", (e) => {
      e.stopPropagation();
      window.open("https://games.sokontokoro-factory.net/");
    });

    const loadingProgressText = new PIXI.Text("タップではじまるよ！");
    loadingProgressText.anchor.set(0.5);
    loadingProgressText.scale.set(app.scale);
    loadingProgressText.x = app.getX(0.5);
    loadingProgressText.y = app.getY(0.9);

    this.container.addChild(
      titleSprite,
      iconHome,
      iconTwitter,
      loadingProgressText
    );

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
