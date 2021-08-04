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

const MIN_SPEED = 1;
const MAX_SPEED = 1.5;
type CallbackableBeat = 0 | 0.125 | 0.25 | 0.375 | 0.5 | 0.625 | 0.75 | 0.875;
const measureMap: { [key: string]: boolean } = {};
let measureCount = 0;
let prevProgress = Number.MAX_SAFE_INTEGER;

const detectBeats = (
  progress: number,
  beatCallbacks: {
    [beat in CallbackableBeat]: (params: { measures: number }) => void;
  }
) => {
  if (progress < prevProgress) {
    measureCount += 1;
  }
  prevProgress = progress;

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
    if (beat < progress && !measureMap[`${measureCount}_${beat}`]) {
      measureMap[`${measureCount}_${beat}`] = true;
      return true;
    }
    return false;
  });

  if (callbackableBeat === undefined) {
    return;
  }

  beatCallbacks[callbackableBeat]({
    measures: measureCount,
  });
};

export class GameState extends ViewState {
  private visibleImagesMap!: { [beat: string]: PIXI.Sprite[] | undefined };

  private rhythmTargetImages!: [
    RhythmTarget,
    RhythmTarget,
    RhythmTarget,
    RhythmTarget
  ];

  private chisato!: Chisato;

  private pointCounter!: PointCounter;

  private speedText?: SpeedText;

  private beatText?: BeatText;

  private drumLoop!: Sound;

  onEnter(): void {
    const { app } = this.context;
    const { debug } = this.context.machineService.state.context;
    const {
      spriteMap,
      soundMap,
    } = this.context.machineService.state.context.loader;

    const gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);

    this.pointCounter = new PointCounter({
      labelTexture: spriteMap.touch_target_ok_takoyaki_1
        .texture as PIXI.Texture,
    });
    this.pointCounter.x = this.context.app.getX(0.5);
    this.pointCounter.y = this.context.app.getY(0.1);
    this.pointCounter.setScale(this.context.app.scale);
    gameContainer.addChild(this.pointCounter);

    this.chisato = new Chisato({
      baseAnimationTextures: Object.entries(
        spriteMap["chisato.spritesheet"].textures || {}
      ).map(([, t]) => t),
      successTexture: spriteMap.chisato_success.texture as PIXI.Texture,
    });
    this.chisato.x = this.context.app.getX(0.5);
    this.chisato.y = this.context.app.getY(0.5);
    this.chisato.setScale(this.context.app.scale * 0.5);
    this.chisato.playAnimation();
    gameContainer.addChild(this.chisato);

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
    gameContainer.addChild(upperLeft, upperRight, lowerLeft, lowerRight);

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

      gameContainer.addChild(this.speedText, this.beatText);
    }

    this.visibleImagesMap = {};
    this.rhythmTargetImages = [upperLeft, upperRight, lowerLeft, lowerRight];

    this.drumLoop = soundMap.drum_loop;
    this.drumLoop.speed = MIN_SPEED;

    hotkeys("q,z,o,m", this.hotkeysCallback);

    this.onGameStart();
  }

  onExit(): void {
    //
  }

  /** ************************************************************************************
   * Game state callbacks
   */
  protected onGameStart(): void {
    sound.play("drum_loop", { loop: true });
    this.context.app.ticker.add(this.gameLoop);
  }

  protected onGameOver(): void {
    sound.stop("drum_loop");
    this.context.app.ticker.remove(this.gameLoop);
    this.chisato.stopAnimation();
    const resultPoint = this.pointCounter.value;
    console.log(`resultPoint: ${resultPoint}`);

    const shareAction = document.getElementById("share-action");
    if (shareAction) {
      shareAction.classList.remove("share-action--hide");
      const sfTwitterShareButton = shareAction.getElementsByTagName(
        "sf-twitter-share-button"
      )[0];
      sfTwitterShareButton.setAttribute("text", `結果は${resultPoint}`);
    }
  }

  /** ************************************************************************************
   * private methods
   */
  private hideSprite = (beat: number) => {
    const visibleImages = this.visibleImagesMap[beat];
    if (visibleImages) {
      visibleImages.forEach((i) => {
        // eslint-disable-next-line no-param-reassign
        i.visible = false;
      });
    }
    this.visibleImagesMap[beat] = undefined;
  };

  private showSprite = (beat: number) => {
    this.hideSprite(beat);

    const normalTargetIndex = randomInt(3);
    const nomalImage = this.rhythmTargetImages[normalTargetIndex];
    nomalImage.show("normal");
    this.visibleImagesMap[beat] = [nomalImage];

    const showNgTarget = randomInt(2) === 0;
    if (showNgTarget) {
      const ngTargetIndex = (normalTargetIndex + 1 + randomInt(2)) % 4;
      const ngImage = this.rhythmTargetImages[ngTargetIndex];
      ngImage.show("ng");
      this.visibleImagesMap[beat]?.push(ngImage);
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
    target.touch();

    if (target.state === "normal" /* success */) {
      sound.play("shan");
      this.pointCounter.countUp();
      this.chisato.showSuccess();
      setTimeout(() => {
        this.chisato.showAnimation();
      }, 200);

      this.vibrate(50);
    } else {
      this.onFail();
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
      if (upperLeft.visible) {
        this.onTapRhythmTarget(upperLeft);
      } else {
        this.onFail();
      }
    }
    if (handler.key === "z") {
      if (lowerLeft.visible) {
        this.onTapRhythmTarget(lowerLeft);
      } else {
        this.onFail();
      }
    }
    if (handler.key === "o") {
      if (upperRight.visible) {
        this.onTapRhythmTarget(upperRight);
      } else {
        this.onFail();
      }
    }
    if (handler.key === "m") {
      if (lowerRight.visible) {
        this.onTapRhythmTarget(lowerRight);
      } else {
        this.onFail();
      }
    }
  };

  private gameLoop = () => {
    const progress: number | undefined = this.drumLoop.instances[0]?.progress;
    if (progress === undefined) {
      return;
    }

    detectBeats(progress, {
      0: ({ measures }) => {
        console.log(progress, "0/4", measures);
        this.checkCountAndUpdateSpeed(measures);

        this.beatText?.show(0);
      },
      0.125: () => {
        console.log(progress, "1/8");
        this.showSprite(1 / 8);
        this.beatText?.show(1);
      },
      0.25: () => {
        console.log(progress, "1/4");
        this.beatText?.show(2);
      },
      0.375: () => {
        console.log(progress, "3/8");
        this.hideSprite(1 / 8);
        this.beatText?.show(3);
      },
      0.5: () => {
        console.log(progress, "2/4");
        this.beatText?.show(4);
      },
      0.625: () => {
        console.log(progress, "5/8");
        this.showSprite(5 / 8);
        this.beatText?.show(5);
      },
      0.75: () => {
        console.log(progress, "3/4");
        this.beatText?.show(6);
      },
      0.875: () => {
        console.log(progress, "7/8");
        this.hideSprite(5 / 8);
        this.beatText?.show(7);
      },
    });
  };

  private onFail = () => {
    sound.play("pon");
    this.vibrate(200);
    this.onGameOver();
  };

  private vibrate = (ms: number) => {
    try {
      navigator.vibrate(ms);
    } catch (e) {
      // ignore
    }
  };
}
