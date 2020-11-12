import * as PIXI from "pixi.js";

import { State, stateMachineService } from "../";

const images = [
  { name: "rina-1", url: "assets/images/rina-1.png" },
  { name: "hako-1", url: "assets/images/hako-1.png" },
  { name: "hako-2", url: "assets/images/hako-2.png" },
  { name: "fukidashi-niko", url: "assets/images/fukidashi-niko.png" },
  { name: "fukidashi-shun", url: "assets/images/fukidashi-shun.png" }
];

export class LoadingState implements State {
  public static nodeKey = "@loading";

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter() {
    images.forEach(image => {
      this.context.app.loader.add(image.name, image.url);
    });
    this.context.app.loader.load(() => {
      this.goNext();
    });
  }
  onExit() {}
  goNext() {
    stateMachineService.send("LOADED");
  }
}
