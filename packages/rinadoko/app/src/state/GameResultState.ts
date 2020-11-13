import * as PIXI from "pixi.js";
import PIXISound from "pixi-sound";

import { State, StateEnterParams, stateMachineService } from "../index";
import { Result } from "../model/Result";
import { tweetByWebIntent } from "@sokontokoro/mikan/dist/utils";

export class GameResultState implements State {
  public static nodeKey = "@game-result";

  private shareController: HTMLElement;
  private twitterShare: HTMLElement;
  private pixiState: HTMLElement;
  private result: Result;
  private soundButton1: PIXISound.Sound;
  private soundBgm2: PIXISound.Sound;

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    const { resources } = this.context.app.loader;

    this.shareController = document.getElementById("share-controller");
    this.twitterShare = document.getElementById("twitter-share");
    this.pixiState = document.getElementById("pixi");
    this.soundButton1 = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_button1"]
    );
    this.soundBgm2 = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_bgm2"]
    );

    this.result = new Result({
      scale: this.context.scale,
      screen: {
        width: this.context.app.screen.width,
        height: this.context.app.screen.height
      },
      textures: {
        result0: resources["last-1"].texture,
        result1: resources["last-2"].texture,
        result2: resources["last-3"].texture
      }
    });

    this.result.point = context.correctSelectCount;

    this.context.app.stage.removeChild(
      ...context.rinaCandidates.map(r => r.container)
    );
    this.context.app.stage.addChild(this.result.container);

    this.showShareController();
    this.soundBgm2.play();

    // add event listeners
    setTimeout(() => {
      this.pixiState.addEventListener("pointerdown", this.onTapStage);
      this.twitterShare.addEventListener(
        "pointerdown",
        this.onClickTwitterShare
      );
    });
  }
  onExit({ context }) {
    this.hideShareController();
    this.context.app.stage.removeChild(this.result.container);

    this.pixiState.removeEventListener("pointerdown", this.onTapStage);
    this.twitterShare.removeEventListener(
      "pointerdown",
      this.onClickTwitterShare
    );
  }

  onTapStage = () => {
    this.soundButton1.play();
    stateMachineService.send("RESTART");
  };

  showShareController() {
    this.shareController.classList.remove("share-controller--hide");
  }

  hideShareController() {
    this.shareController.classList.add("share-controller--hide");
  }

  onClickTwitterShare = () => {
    let text = `全然見つけられなかった...`;
    if (0 < this.result.point) {
      text = `${this.result.point}回見つけられたよ！`;
    }

    tweetByWebIntent({
      text,
      url: "https://games.sokontokoro-factory.net/rinadoko/",
      hashtags: [
        "リナちゃんボックスどこ",
        "そこんところ工房",
        "lovelive",
        "虹ヶ咲"
      ]
    });
  };
}
