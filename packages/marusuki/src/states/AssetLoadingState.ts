import * as PIXI from "pixi-v6";
import { ViewState } from "../ViewState";
import { assets } from "../assets";
import { loadSound, loadSprite } from "../helper/loader";

export class AssetLoadingState extends ViewState {
  private container!: PIXI.Container;

  onEnter(): void {
    const { app } = this.context;
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);

    const loadingProgressText = new PIXI.Text(`0%`);
    loadingProgressText.anchor.set(0.5);
    loadingProgressText.scale.set(app.scale);
    loadingProgressText.x = app.getX(0.5);
    loadingProgressText.y = app.getY(0.8);
    this.container.addChild(loadingProgressText);

    (async () => {
      const soundMap = await loadSound(assets.sounds);
      const spriteMap = await loadSprite(assets.images, (progress) => {
        console.log(progress);
        loadingProgressText.text = `${Math.round(progress)}%`;
      });

      this.context.machineService.state.context.loader = {
        soundMap,
        spriteMap,
      };

      this.sendEvent({ type: "COMPLETED" });
    })();
  }

  onExit(): void {
    const { app } = this.context;
    app.stage.removeChild(this.container);
  }
}
