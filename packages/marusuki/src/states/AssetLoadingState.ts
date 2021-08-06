import * as PIXI from "pixi-v6";
import { ViewState } from "../ViewState";
import { assets } from "../assets";
import { loadSound, loadSprite } from "../helper/loader";
import { TakoDownloadIndicator } from "../sprites/TakoDownloadIndicator";
import { wait } from "../helper/utils";

export class AssetLoadingState extends ViewState {
  private container!: PIXI.Container;

  private progressText!: PIXI.Text;

  private takoDownloadIndicator!: TakoDownloadIndicator;

  onEnter(): void {
    const { app } = this.context;
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);

    this.progressText = new PIXI.Text(``);
    this.progressText.anchor.set(0.5);
    this.progressText.scale.set(app.scale);
    this.progressText.x = app.getX(0.5);
    this.progressText.y = app.getY(0.6);
    this.container.addChild(this.progressText);

    this.takoDownloadIndicator = new TakoDownloadIndicator();
    this.takoDownloadIndicator.scale.set(app.scale);
    this.takoDownloadIndicator.x = app.getX(0.5);
    this.takoDownloadIndicator.y = app.getY(0.5);
    this.container.addChild(this.takoDownloadIndicator);

    (async () => {
      this.updateProgress(0);
      const soundMap = await loadSound(assets.sounds);
      const spriteMap = await loadSprite(assets.images, (progress) => {
        this.updateProgress(progress);
      });

      this.context.machineService.state.context.loader = {
        soundMap,
        spriteMap,
      };

      await wait(500);
      this.sendEvent({ type: "COMPLETED" });
    })();
  }

  onExit(): void {
    const { app } = this.context;
    app.stage.removeChild(this.container);
  }

  private updateProgress(progress: number) {
    this.progressText.text = `Downloading... ${Math.round(progress)}%`;
    this.takoDownloadIndicator.update(progress);
  }
}
