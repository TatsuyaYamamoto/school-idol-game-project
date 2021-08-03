import * as PIXI from "pixi-v6";
import { IMediaInstance, sound } from "@pixi/sound";
import hotkeys from "hotkeys-js";

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
  onEnter(): void {
    const { app } = this.context;
    const {
      spriteMap,
      soundMap,
    } = this.context.machineService.state.context.loader;

    const gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);

    const pointCounter = new PointCounter({
      labelTexture: spriteMap.touch_target_ok_takoyaki_1
        .texture as PIXI.Texture,
    });
    pointCounter.x = this.context.app.getX(0.5);
    pointCounter.y = this.context.app.getY(0.1);
    pointCounter.setScale(this.context.app.scale);

    const speedText = new SpeedText(MIN_SPEED);
    speedText.x = this.context.app.getX(0.5);
    speedText.y = this.context.app.getY(0.95);
    speedText.scale.set(this.context.app.scale);

    const beatText = new BeatText();
    beatText.x = this.context.app.getX(0.5);
    beatText.y = this.context.app.getY(0.85);
    beatText.scale.set(this.context.app.scale);
    beatText.anchor.set(0.5);

    const chisato = new Chisato({
      baseAnimationTextures: Object.entries(
        spriteMap["chisato.spritesheet"].textures || {}
      ).map(([, t]) => t),
      successTexture: spriteMap.chisato_success.texture as PIXI.Texture,
    });
    chisato.x = this.context.app.getX(0.5);
    chisato.y = this.context.app.getY(0.5);
    chisato.setScale(this.context.app.scale * 0.5);
    chisato.playAnimation();
    gameContainer.addChild(chisato);

    const onTapRhythmTarget = (target: RhythmTarget): void => {
      target.touch();

      if (target.state === "normal" /* success */) {
        sound.play("shan");
        pointCounter.countUp();
        chisato.showSuccess();
        setTimeout(() => {
          chisato.showAnimation();
        }, 200);

        try {
          navigator.vibrate(50);
        } catch (e) {
          // ignore
        }
      } else {
        sound.play("pon");
        navigator.vibrate(200);
      }
    };

    const [upperLeft, upperRight, lowerLeft, lowerRight] = [
      { x: 0.15, y: 0.2 },
      { x: 0.85, y: 0.2 },
      { x: 0.15, y: 0.8 },
      { x: 0.85, y: 0.8 },
    ].map((params) => {
      const sprite = new RhythmTarget({
        normalTexture: spriteMap.touch_target_ok_takoyaki_1
          .texture as PIXI.Texture,
        touchedTexture: spriteMap.touch_target_effect_blue
          .texture as PIXI.Texture,
        ngTextures: [
          spriteMap.touch_target_ng_piman_1.texture as PIXI.Texture,
          spriteMap.touch_target_ng_piman_2.texture as PIXI.Texture,
        ],
      });
      sprite.x = this.context.app.getX(params.x);
      sprite.y = this.context.app.getY(params.y);
      sprite.scale.set(this.context.app.scale * 0.4);
      sprite.on("pointerdown", () => {
        onTapRhythmTarget(sprite);
      });
      return sprite;
    });

    gameContainer.addChild(upperLeft, upperRight, lowerLeft, lowerRight);
    gameContainer.addChild(pointCounter, speedText, beatText);

    const images = [upperLeft, upperRight, lowerLeft, lowerRight] as const;
    const visibleImagesMap: { [beat: string]: PIXI.Sprite[] | undefined } = {};
    const drumLoop = soundMap.drum_loop;
    drumLoop.speed = MIN_SPEED;
    let drumLoopInstance: IMediaInstance | null = null;

    hotkeys("q,z,o,m", (event, handler) => {
      event.preventDefault();

      if (handler.key === "q") {
        if (upperLeft.visible) {
          onTapRhythmTarget(upperLeft);
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "z") {
        if (lowerLeft.visible) {
          onTapRhythmTarget(lowerLeft);
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "o") {
        if (upperRight.visible) {
          onTapRhythmTarget(upperRight);
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "m") {
        if (lowerRight.visible) {
          onTapRhythmTarget(lowerRight);
        } else {
          sound.play("pon");
        }
      }
    });

    const hideSprite = (beat: number) => {
      const visibleImages = visibleImagesMap[beat];
      if (visibleImages) {
        visibleImages.forEach((i) => {
          // eslint-disable-next-line no-param-reassign
          i.visible = false;
        });
      }
      visibleImagesMap[beat] = undefined;
    };

    const showSprite = (beat: number) => {
      hideSprite(beat);

      const normalTargetIndex = randomInt(3);
      const nomalImage = images[normalTargetIndex];
      nomalImage.show("normal");
      visibleImagesMap[beat] = [nomalImage];

      const showNgTarget = randomInt(2) === 0;
      if (showNgTarget) {
        const ngTargetIndex = (normalTargetIndex + 1 + randomInt(2)) % 4;
        const ngImage = images[ngTargetIndex];
        ngImage.show("ng");
        visibleImagesMap[beat]?.push(ngImage);
      }
    };

    const checkCountAndUpdateSpeed = (measures: number) => {
      const increment = 0.1 * Math.floor(measures / 4);
      const newSpeed =
        MIN_SPEED + increment < MAX_SPEED ? MIN_SPEED + increment : MAX_SPEED;

      drumLoop.speed = newSpeed;
      speedText.change(newSpeed);
    };

    const startApp = () => {
      sound.play("drum_loop", { loop: true });
      drumLoopInstance = drumLoop.instances[0] || null;
      app.ticker.add(() => {
        const progress = drumLoopInstance?.progress;
        if (progress === undefined) {
          return;
        }

        detectBeats(progress, {
          0: ({ measures }) => {
            beatText.text = `0/8`;
            console.log(progress, "0/4", measures);
            checkCountAndUpdateSpeed(measures);
          },
          0.125: () => {
            beatText.text = `[ 1/8 ]`;
            console.log(progress, "1/8");

            showSprite(1 / 8);
          },
          0.25: () => {
            beatText.text = `[ [ 2/8 ] ]`;
            console.log(progress, "1/4");
          },
          0.375: () => {
            beatText.text = `[ 3/8 ]`;
            console.log(progress, "3/8");

            hideSprite(1 / 8);
          },
          0.5: () => {
            beatText.text = `4/8`;
            console.log(progress, "2/4");
          },
          0.625: () => {
            beatText.text = `[ 5/8 ]`;
            console.log(progress, "5/8");

            showSprite(5 / 8);
          },
          0.75: () => {
            beatText.text = `[ [ 6/8 ] ]`;
            console.log(progress, "3/4");
          },
          0.875: () => {
            beatText.text = `[ 7/8 ]`;
            console.log(progress, "7/8");

            hideSprite(5 / 8);
          },
        });
      });
    };

    startApp();
  }

  onExit(): void {
    //
  }
}
