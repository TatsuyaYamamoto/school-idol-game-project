import { Texture, interaction } from "pixi.js";

import Button from "../../internal/Button";
import { Ids } from "../../../resources/image";
import { loadFrames } from "../../../../framework/AssetLoader";
import { isMute } from "../../../../framework/MusicPlayer";

class SoundButton extends Button {
  private _onTexture: Texture;
  private _offTexture: Texture;

  constructor() {
    const frames = loadFrames(Ids.BUTTON_SOUND);

    const offTexture = frames[0];
    const onTexture = frames[1];

    super(onTexture);

    this._onTexture = onTexture;
    this._offTexture = offTexture;

    isMute() ? this.turnOff() : this.turnOn();
    this.setOnClickListener(
      (event: interaction.InteractionEvent) =>
        isMute() ? this.turnOn() : this.turnOff()
    );
  }

  public turnOn(): void {
    this.texture = this._onTexture;
  }

  public turnOff(): void {
    this.texture = this._offTexture;
  }
}

export default SoundButton;
