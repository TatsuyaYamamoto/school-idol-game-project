import { ViewState } from "../ViewState";
import { loadSound, loadSprite } from "../../assetLoader";

const assets = {
  images: [
    { name: "chisato", url: "assets/images/chisato.png" },
    { name: "takoyaki", url: "assets/images/takoyaki.png" },
    { name: "takoyaki_crush", url: "assets/images/takoyaki_crush.png" },
    {
      name: "touch_target_ng_piman",
      url: "assets/images/touch_target_ng_piman.png",
    },
  ],
  sounds: [
    { id: "shan", url: "assets/sounds/shan.wav" },
    {
      id: "pon",
      url: "assets/sounds/pon.mp3",
    },
    {
      id: "drum_loop",
      url: "assets/sounds/drum_loop.wav",
    },
  ],
};

export class AssetLoadingState extends ViewState {
  onEnter(): void {
    (async () => {
      const soundMap = await loadSound(assets.sounds);
      const spriteMap = await loadSprite(assets.images);

      this.context.machineService.state.context.loader = {
        soundMap,
        spriteMap,
      };

      this.sendEvent({ type: "COMPLETED" });
    })();
  }

  onExit(): void {
    //
  }
}
