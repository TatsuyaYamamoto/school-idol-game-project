import { ViewState } from "../stateMachine/ViewState";
import { assets } from "../assets";
import { loadSound, loadSprite } from "../helper/loader";

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
