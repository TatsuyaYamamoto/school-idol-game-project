import * as PIXI from "pixi.js";

import { State, stateMachineService } from "../";

const images = [
  { name: "hako-1", url: "images/hako-1.png" },
  { name: "hako-2", url: "images/hako-2.png" },
  { name: "fukidashi-niko", url: "images/fukidashi-niko.png" }
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
