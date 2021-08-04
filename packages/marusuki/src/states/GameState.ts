import * as PIXI from "pixi-v6";
import { Sound, sound } from "@pixi/sound";
import hotkeys, { KeyHandler } from "hotkeys-js";

import { ViewState } from "../ViewState";

import { Chisato } from "../sprites/Chisato";
import { SpeedText } from "../sprites/SpeedText";
import { RhythmTarget } from "../sprites/RhythmTarget";
import { BeatText } from "../sprites/BeatText";

import { randomInt } from "../helper/utils";
import { PointCounter } from "../sprites/PointCounter";
import { GameoverEffect } from "../sprites/GameoverEffect";

const MIN_SPEED = 1;
const MAX_SPEED = 1.5;
type CallbackableBeat = 0 | 0.125 | 0.25 | 0.375 | 0.5 | 0.625 | 0.75 | 0.875;

export class GameState extends ViewState {
  private rhythmTargetImages!: [
    RhythmTarget,
    RhythmTarget,
    RhythmTarget,
    RhythmTarget
  ];

  private gameContainer!: PIXI.Container;

  private chisato!: Chisato;

  private pointCounter!: PointCounter;

  private speedText?: SpeedText;

  private beatText?: BeatText;

  private gameoverEffect!: GameoverEffect;

  private drumLoop!: Sound;

  private measureMap: { [key: string]: boolean } = {};

  private measureCount = 0;

  private prevProgress = Number.MAX_SAFE_INTEGER;

  onEnter(): void {
    const { app } = this.context;
    const { debug } = this.context.machineService.state.context;
    const {
      spriteMap,
      soundMap,
    } = this.context.machineService.state.context.loader;

    this.gameContainer = new PIXI.Container();
    app.stage.addChild(this.gameContainer);

    this.pointCounter = new PointCounter({
      labelTexture: spriteMap.touch_target_ok_takoyaki_1
        .texture as PIXI.Texture,
    });
    this.pointCounter.x = this.context.app.getX(0.5);
    this.pointCounter.y = this.context.app.getY(0.1);
    this.pointCounter.setScale(this.context.app.scale);
    this.gameContainer.addChild(this.pointCounter);

    this.chisato = new Chisato({
      baseAnimationTextures: Object.entries(
        spriteMap["chisato.spritesheet"].textures || {}
      ).map(([, t]) => t),
      successTexture: spriteMap.chisato_success.texture as PIXI.Texture,
      resultTextures: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
        (i) => spriteMap[`chisato_gameover_${i}`].texture as PIXI.Texture
      ),
    });
    this.chisato.x = this.context.app.getX(0.5);
    this.chisato.y = this.context.app.getY(0.5);
    this.chisato.setScale(this.context.app.scale * 0.5);
    this.gameContainer.addChild(this.chisato);

    const [upperLeft, upperRight, lowerLeft, lowerRight] = [
      { x: 0.15, y: 0.2 },
      { x: 0.85, y: 0.2 },
      { x: 0.15, y: 0.8 },
      { x: 0.85, y: 0.8 },
    ].map((params) => {
      const sprite = new RhythmTarget({
        normalTexture: spriteMap.touch_target_ok_takoyaki_1
          .texture as PIXI.Texture,
        touchedTextures: [
          spriteMap.touch_target_effect_blue.texture as PIXI.Texture,
          spriteMap.touch_target_effect_green.texture as PIXI.Texture,
          spriteMap.touch_target_effect_orange.texture as PIXI.Texture,
          spriteMap.touch_target_effect_pink.texture as PIXI.Texture,
          spriteMap.touch_target_effect_skyblue.texture as PIXI.Texture,
        ],
        ngTextures: [
          spriteMap.touch_target_ng_piman_1.texture as PIXI.Texture,
          spriteMap.touch_target_ng_piman_2.texture as PIXI.Texture,
        ],
      });
      sprite.x = this.context.app.getX(params.x);
      sprite.y = this.context.app.getY(params.y);
      sprite.scale.set(this.context.app.scale * 0.4);
      sprite.on("pointerdown", () => {
        this.onTapRhythmTarget(sprite);
      });
      return sprite;
    });
    this.gameContainer.addChild(upperLeft, upperRight, lowerLeft, lowerRight);

    this.gameoverEffect = new GameoverEffect({
      texture: spriteMap.gameover_effect.texture as PIXI.Texture,
    });
    this.gameoverEffect.x = this.context.app.getX(0.5);
    this.gameoverEffect.y = this.context.app.getY(0.1);
    this.gameoverEffect.setScale(this.context.app.scale * 0.5);
    this.gameoverEffect.hide();
    this.gameContainer.addChild(this.gameoverEffect);

    if (debug) {
      this.speedText = new SpeedText(MIN_SPEED);
      this.speedText.x = this.context.app.getX(0.5);
      this.speedText.y = this.context.app.getY(0.95);
      this.speedText.scale.set(this.context.app.scale);

      this.beatText = new BeatText();
      this.beatText.x = this.context.app.getX(0.5);
      this.beatText.y = this.context.app.getY(0.85);
      this.beatText.scale.set(this.context.app.scale);
      this.beatText.anchor.set(0.5);

      this.gameContainer.addChild(this.speedText, this.beatText);
    }

    this.rhythmTargetImages = [upperLeft, upperRight, lowerLeft, lowerRight];
    this.drumLoop = soundMap.drum_loop;

    hotkeys("q,z,o,m", this.hotkeysCallback);

    this.resetGameVariables();
    this.onGameStart();
  }

  onExit(): void {
    hotkeys.unbind("q,z,o,m", this.hotkeysCallback);
  }

  /** ************************************************************************************
   * Game state callbacks
   */
  protected onGameStart(): void {
    this.chisato.showAnimation();
    this.chisato.startAnimation();
    sound.play("drum_loop", { loop: true, speed: MIN_SPEED });
    this.context.app.ticker.add(this.gameLoop);
  }

  protected onGameOver(): void {
    sound.stop("drum_loop");
    this.context.app.ticker.remove(this.gameLoop);
    this.rhythmTargetImages.forEach((i) => {
      i.hide();
    });
    this.chisato.stopAnimation();
    const resultPoint = this.pointCounter.value;
    console.log(`resultPoint: ${resultPoint}`);

    this.gameoverEffect.show();
    this.chisato.showResult(resultPoint);

    const shareAction = document.getElementById("share-action");
    if (shareAction) {
      shareAction.classList.remove("share-action--hide");
      const sfTwitterShareButton = shareAction.getElementsByTagName(
        "sf-twitter-share-button"
      )[0];
      sfTwitterShareButton.setAttribute("text", `結果は${resultPoint}`);
    }

    setTimeout(() => {
      document
        .getElementById("app")
        ?.addEventListener("pointerdown", this.restartGame);
    }, 600);
  }

  /** ************************************************************************************
   * private methods
   */
  private checkGameOver = (): void => {
    if (this.context.machineService.state.context.debug) {
      this.rhythmTargetImages.forEach((i) => i.hide());
      return;
    }

    const tappableTarget = this.rhythmTargetImages.find((visibleImage) => {
      return visibleImage.tappable;
    });
    if (!tappableTarget) {
      // OK
      return;
    }

    sound.play("pon");
    this.vibrate(200);
    this.onGameOver();
  };

  private resetGameVariables = (): void => {
    this.pointCounter.reset();
    this.measureMap = {};
    this.measureCount = 0;
    this.prevProgress = Number.MAX_SAFE_INTEGER;
    this.gameoverEffect.hide();
  };

  private showSprite = () => {
    this.rhythmTargetImages.forEach((i) => i.hide());

    const normalTargetIndex = randomInt(3);
    const normalImage = this.rhythmTargetImages[normalTargetIndex];
    normalImage.show("normal");

    const showNgTarget = randomInt(2) === 0;
    if (showNgTarget) {
      const ngTargetIndex = (normalTargetIndex + 1 + randomInt(2)) % 4;
      const ngImage = this.rhythmTargetImages[ngTargetIndex];
      ngImage.show("ng");
    }
  };

  private checkCountAndUpdateSpeed = (measures: number) => {
    const increment = 0.1 * Math.floor(measures / 4);
    const newSpeed =
      MIN_SPEED + increment < MAX_SPEED ? MIN_SPEED + increment : MAX_SPEED;

    this.drumLoop.speed = newSpeed;
    this.speedText?.change(newSpeed);
  };

  private onTapRhythmTarget = (target: RhythmTarget): void => {
    if (target.state === "normal") {
      if (target.tappable) {
        sound.play("shan");
        target.showSuccessAnimation();
        this.pointCounter.countUp();
        this.chisato.showSuccess();
        setTimeout(() => {
          this.chisato.showAnimation();
          this.rhythmTargetImages.forEach((i) => i.hide());
        }, 200);

        this.vibrate(50);
      }
    } else {
      sound.play("pon");
      this.vibrate(200);
      this.onGameOver();
    }
  };

  private hotkeysCallback: KeyHandler = (event, handler) => {
    event.preventDefault();
    // `this.rhythmTargetImages` の代入の順番と変わっていないことに注意！
    const [
      upperLeft,
      upperRight,
      lowerLeft,
      lowerRight,
    ] = this.rhythmTargetImages;

    if (handler.key === "q") {
      this.onTapRhythmTarget(upperLeft);
    }
    if (handler.key === "z") {
      this.onTapRhythmTarget(lowerLeft);
    }
    if (handler.key === "o") {
      this.onTapRhythmTarget(upperRight);
    }
    if (handler.key === "m") {
      this.onTapRhythmTarget(lowerRight);
    }
  };

  private gameLoop = () => {
    const progress: number | undefined = this.drumLoop.instances[0]?.progress;
    if (progress === undefined) {
      return;
    }

    this.detectBeats(progress, {
      0: () => {
        console.log(progress, "0/4", this.measureCount);
        this.checkCountAndUpdateSpeed(this.measureCount);

        this.beatText?.show(0);
      },
      0.125: () => {
        console.log(progress, "1/8");
        this.showSprite();
        this.beatText?.show(1);
      },
      0.25: () => {
        console.log(progress, "1/4");
        this.beatText?.show(2);
      },
      0.375: () => {
        console.log(progress, "3/8");
        this.checkGameOver();
        this.beatText?.show(3);
      },
      0.5: () => {
        console.log(progress, "2/4");
        this.beatText?.show(4);
      },
      0.625: () => {
        console.log(progress, "5/8");
        this.showSprite();
        this.beatText?.show(5);
      },
      0.75: () => {
        console.log(progress, "3/4");
        this.beatText?.show(6);
      },
      0.875: () => {
        console.log(progress, "7/8");
        this.checkGameOver();
        this.beatText?.show(7);
      },
    });
  };

  private vibrate = (ms: number) => {
    try {
      navigator.vibrate(ms);
    } catch (e) {
      // ignore
    }
  };

  private restartGame = () => {
    document
      .getElementById("app")
      ?.removeEventListener("pointerdown", this.restartGame);
    document
      .getElementById("share-action")
      ?.classList.add("share-action--hide");

    this.resetGameVariables();
    this.onGameStart();
  };

  private detectBeats = (
    progress: number,
    beatCallbacks: {
      [beat in CallbackableBeat]: () => void;
    }
  ) => {
    if (progress < this.prevProgress) {
      this.measureCount += 1;
    }
    this.prevProgress = progress;

    const beats: CallbackableBeat[] = [
      0,
      0.125,
      0.25,
      0.375,
      0.5,
      0.625,
      0.75,
      0.875,
    ];

    const callbackableBeat = beats.find((beat) => {
      if (beat < progress && !this.measureMap[`${this.measureCount}_${beat}`]) {
        this.measureMap[`${this.measureCount}_${beat}`] = true;
        return true;
      }
      return false;
    });

    if (callbackableBeat === undefined) {
      return;
    }

    beatCallbacks[callbackableBeat]();
  };
}
