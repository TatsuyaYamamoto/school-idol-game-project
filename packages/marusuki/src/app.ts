import * as PIXI from "pixi-v6";
import hotkeys from "hotkeys-js";
import { IMediaInstance, sound } from "@pixi/sound";

import { CounterText } from "./sprites/CounterText";
import { loadSound, loadSprite } from "./assetLoader";
import { randomInt } from "./helper/utils";
import { SpeedText } from "./sprites/SpeedText";
import { RhythmTarget } from "./sprites/RhythmTarget";

const MIN_SPEED = 1;
const MAX_SPEED = 1.5;
const measureMap: { [key: string]: boolean } = {};
let measureCount = 0;
let prevProgress = Number.MAX_SAFE_INTEGER;

const assets = {
  images: [
    { name: "chisato", url: "assets/images/chisato.png" },
    { name: "takoyaki", url: "assets/images/takoyaki.png" },
    { name: "takoyaki_crush", url: "assets/images/takoyaki_crush.png" },
    {
      name: "touch_target_ng_piman",
      url: "assets/images/touch_target_ng_piman.png",
    },
  ],
  sounds: [
    { id: "shan", url: "assets/sounds/shan.wav" },
    {
      id: "pon",
      url: "assets/sounds/pon.mp3",
    },
    {
      id: "drum_loop",
      url: "assets/sounds/drum_loop.wav",
    },
  ],
};

type CallbackableBeat = 0 | 0.125 | 0.25 | 0.375 | 0.5 | 0.625 | 0.75 | 0.875;

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

export const start = async (el: Element): Promise<void> => {
  const app = new PIXI.Application({
    backgroundColor: parseInt("#f3f2f2".replace("#", ""), 16),
    autoStart: false,
  });
  el.appendChild(app.view);

  const gameContainer = new PIXI.Container();
  app.stage.addChild(gameContainer);

  const soundMap = await loadSound(assets.sounds);
  const spriteMap = await loadSprite(assets.images);

  const successCounterText = new CounterText("Count: ");
  successCounterText.x = 400;
  successCounterText.y = 20;
  successCounterText.anchor.set(0.5);

  const speedText = new SpeedText(MIN_SPEED);
  speedText.x = 400;
  speedText.y = 50;
  speedText.anchor.set(0.5);

  const ngCounterText = new CounterText("NG: ");
  ngCounterText.x = 400;
  ngCounterText.y = 80;
  ngCounterText.anchor.set(0.5);

  const beatText = new PIXI.Text(``);
  beatText.x = 400;
  beatText.y = 110;
  beatText.anchor.set(0.5);

  const onTapRhythmTarget = (target: RhythmTarget): void => {
    target.touch();

    if (target.state === "normal" /* success */) {
      sound.play("shan");
      navigator.vibrate(50);
      successCounterText.countUp();
    } else {
      sound.play("pon");
      navigator.vibrate(200);
      ngCounterText.countUp();
    }
  };

  const [upperLeft, upperRight, lowerLeft, lowerRight] = [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 100, y: 450 },
    { x: 700, y: 450 },
  ].map((params) => {
    const sprite = new RhythmTarget({
      normal: spriteMap.takoyaki.texture as PIXI.Texture,
      normalTouched: spriteMap.takoyaki_crush.texture as PIXI.Texture,
      ng: spriteMap.touch_target_ng_piman.texture as PIXI.Texture,
      ngTouched: spriteMap.touch_target_ng_piman.texture as PIXI.Texture,
    });
    sprite.x = params.x;
    sprite.y = params.y;
    sprite.on("pointerdown", () => {
      onTapRhythmTarget(sprite);
    });
    return sprite;
  });

  gameContainer.addChild(upperLeft, upperRight, lowerLeft, lowerRight);
  gameContainer.addChild(
    successCounterText,
    speedText,
    ngCounterText,
    beatText
  );

  const chisato = new PIXI.Sprite(spriteMap.chisato.texture);
  chisato.x = app.renderer.width * 0.5;
  chisato.y = app.renderer.height * 0.5;
  chisato.anchor.set(0.5);
  gameContainer.addChild(chisato);

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
    app.start();
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
};
