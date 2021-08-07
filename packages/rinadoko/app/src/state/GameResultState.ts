import PIXISound from "pixi-sound";
import { tweetByWebIntent } from "@sokontokoro/mikan/dist/utils";
import { sendEvent } from "../utils";

import {
  State,
  StateContext,
  StateEnterParams,
  stateMachineService,
} from "../index";
import { Result } from "../model/Result";

export class GameResultState implements State {
  public static nodeKey = "@game-result";

  private stateContext: StateContext;

  private shareController: HTMLElement;

  private twitterShare: HTMLElement;

  private pixiState: HTMLElement;

  private result: Result;

  private soundButton1: PIXISound.Sound;

  private soundBgm2: PIXISound.Sound;

  constructor(context: StateContext) {
    this.stateContext = context;
  }

  onEnter({ context }: StateEnterParams): void {
    const { resources } = this.stateContext.app.loader;

    this.shareController = document.getElementById("share-controller");
    this.twitterShare = document.getElementById("twitter-share");
    this.pixiState = document.getElementById("pixi");
    this.soundButton1 = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_button1
    );
    this.soundBgm2 = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_bgm2
    );

    this.result = new Result({
      scale: this.stateContext.scale,
      screen: {
        width: this.stateContext.app.screen.width,
        height: this.stateContext.app.screen.height,
      },
      textures: {
        result0: resources["last-1"].texture,
        result1: resources["last-2"].texture,
        result2: resources["last-3"].texture,
      },
    });

    this.result.point = context.correctSelectCount;

    this.stateContext.app.stage.removeChild(
      ...context.rinaCandidates.map((r) => r.container)
    );
    this.stateContext.app.stage.addChild(this.result.container);

    this.showShareController();
    this.soundBgm2.play({ volume: 0.2 });

    // add event listeners
    setTimeout(() => {
      this.pixiState.addEventListener("pointerdown", this.onTapStage);
      this.twitterShare.addEventListener(
        "pointerdown",
        this.onClickTwitterShare
      );
    });

    // tracking
    sendEvent("pointerdown", {
      label: "result",
      value: this.result.point,
    });
  }

  onExit(): void {
    this.hideShareController();
    this.stateContext.app.stage.removeChild(this.result.container);
    this.soundBgm2.stop();

    this.pixiState.removeEventListener("pointerdown", this.onTapStage);
    this.twitterShare.removeEventListener(
      "pointerdown",
      this.onClickTwitterShare
    );
  }

  onTapStage = (): void => {
    this.soundButton1.play();
    stateMachineService.send("RESTART");
  };

  showShareController(): void {
    this.shareController.classList.remove("share-controller--hide");
  }

  hideShareController(): void {
    this.shareController.classList.add("share-controller--hide");
  }

  onClickTwitterShare = (): void => {
    let text = `全然見つけられなかった...`;
    if (this.result.point > 0) {
      text = `${this.result.point}回見つけられたよ！`;
    }

    tweetByWebIntent({
      text,
      url: "https://games.sokontokoro-factory.net/rinadoko/",
      hashtags: [
        "リナちゃんボックスどこ",
        "そこんところ工房",
        "lovelive",
        "虹ヶ咲",
      ],
    });
  };
}
