import { Application } from "pixi.js";

import { State, StateEnterParams, stateMachineService } from "../";

const images = [
  { name: "last-1", url: "assets/images/last-1.png" },
  { name: "last-2", url: "assets/images/last-2.png" },
  { name: "last-3", url: "assets/images/last-3.png" },
  { name: "rina-1", url: "assets/images/rina-1.png" },
  { name: "hako-1", url: "assets/images/hako-1.png" },
  { name: "hako-2", url: "assets/images/hako-2.png" },
  { name: "fukidashi-niko", url: "assets/images/fukidashi-niko.png" },
  { name: "fukidashi-shun", url: "assets/images/fukidashi-shun.png" },
  // sound
  { name: "sound_move1", url: "assets/sounds/move1.128k.aac" },
  { name: "sound_button1", url: "assets/sounds/button1.128k.aac" },
  { name: "sound_ok", url: "assets/sounds/ok.128k.aac" },
  { name: "sound_ng", url: "assets/sounds/ng.128k.aac" },
  { name: "sound_bgm1", url: "assets/sounds/bgm1.128k.aac" },
  { name: "sound_bgm2", url: "assets/sounds/bgm2.128k.aac" }
];

export class LoadingState implements State {
  public static nodeKey = "@loading";

  constructor(private context: { app: Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    images.forEach(image => {
      this.context.app.loader.add(image.name, image.url);
    });
    this.context.app.loader.load(() => {
      this.goNext();
    });
  }
  onExit({ context }) {}
  goNext() {
    stateMachineService.send("LOADED");
  }
}
