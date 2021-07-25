import * as PIXI from "pixi.js";
import hotkeys from "hotkeys-js";
import { sound } from "@pixi/sound";

import { CounterText } from "./sprites/CounterText";
import { loadSound, loadSprite } from "./assetLoader";
import { between, randomInt } from "./helper/utils";
import { SpeedText } from "./sprites/SpeedText";

const MIN_SPEED = 1;
const MAX_SPEED = 1.5;
const measureMap: { [key: string]: boolean } = {};
let measureCount = 0;
let prevProgress = Number.MAX_SAFE_INTEGER;

const detectBeats = (
  progress: number,
  params: { [beat: number]: (params: { measures: number }) => void }
) => {
  if (progress < prevProgress) {
    measureCount += 1;
  }
  prevProgress = progress;
  const diff = 0.01;

  const targetBeat = Object.keys(params)
    .map((beatString) => {
      return Number(beatString);
    })
    .find((beat) => {
      if (
        between(beat - diff, progress, beat + diff) &&
        !measureMap[`${measureCount}_${beat}`]
      ) {
        measureMap[`${measureCount}_${beat}`] = true;
        return true;
      }
      return false;
    });

  if (targetBeat !== undefined && params[targetBeat]) {
    params[targetBeat]({ measures: measureCount });
  }
};

export const start = async (): Promise<PIXI.Application> => {
  const app = new PIXI.Application({
    backgroundColor: parseInt("#efefef".replace("#", ""), 16),
    autoStart: false,
  });
  const gameContainer = new PIXI.Container();
  app.stage.addChild(gameContainer);

  const soundMap = await loadSound([
    { id: "shan", url: "assets/sounds/shan.mp3" },
    {
      id: "pon",
      url: "assets/sounds/pon.mp3",
    },
    {
      id: "drum_loop",
      url: "assets/sounds/drum_loop.wav",
    },
  ]);
  const spriteMap = await loadSprite(app.loader, [
    { name: "chisato", url: "assets/images/chisato.png" },
    { name: "takoyaki", url: "assets/images/takoyaki.png" },
  ]);

  const counterText = new CounterText();
  counterText.x = 400;
  counterText.y = 20;
  counterText.anchor.set(0.5);

  const speedText = new SpeedText(MIN_SPEED);
  speedText.x = 400;
  speedText.y = 50;
  speedText.anchor.set(0.5);

  const [upperLeft, upperRight, lowerLeft, lowerRight] = [
    { x: 10, y: 10 },
    { x: 700, y: 10 },
    { x: 10, y: 450 },
    { x: 700, y: 450 },
  ].map((params) => {
    const sprite = new PIXI.Sprite(spriteMap.takoyaki.texture);
    sprite.x = params.x;
    sprite.y = params.y;
    sprite.visible = false;
    sprite.interactive = true;
    sprite.on("pointerdown", () => {
      sound.play("shan");
      counterText.countUp();
    });
    return sprite;
  });

  gameContainer.addChild(upperLeft);
  gameContainer.addChild(upperRight);
  gameContainer.addChild(lowerLeft);
  gameContainer.addChild(lowerRight);
  gameContainer.addChild(counterText);
  gameContainer.addChild(speedText);

  const chisato = new PIXI.Sprite(spriteMap.chisato.texture);
  chisato.x = app.renderer.width * 0.5;
  chisato.y = app.renderer.height * 0.5;
  chisato.anchor.set(0.5);
  gameContainer.addChild(chisato);

  const startApp = () => {
    hotkeys("q,z,o,m", (event, handler) => {
      event.preventDefault();

      if (handler.key === "q") {
        if (upperLeft.visible) {
          sound.play("shan");
          counterText.countUp();
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "z") {
        if (lowerLeft.visible) {
          sound.play("shan");
          counterText.countUp();
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "o") {
        if (upperRight.visible) {
          sound.play("shan");
          counterText.countUp();
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "m") {
        if (lowerRight.visible) {
          sound.play("shan");
          counterText.countUp();
        } else {
          sound.play("pon");
        }
      }
    });
    app.start();
    sound.play("drum_loop", { loop: true });

    const drumLoop = soundMap.drum_loop;
    drumLoop.speed = MIN_SPEED;
    const drumLoopInstance = drumLoop.instances[0];

    const images = [upperLeft, upperRight, lowerLeft, lowerRight] as const;
    const visibleImages: { [beat: string]: PIXI.Sprite | undefined } = {};

    const hideSprite = (beat: number) => {
      const visibleImage = visibleImages[beat];
      if (visibleImage) {
        visibleImage.visible = false;
        visibleImages[beat] = undefined;
      }
    };

    const showSprite = (beat: number) => {
      hideSprite(beat);

      let imageIndex: number | null = null;
      while (imageIndex === null) {
        const randomValue = randomInt(3);
        if (!images[randomValue].visible) {
          imageIndex = randomValue;
        }
      }

      const visibleImage = images[imageIndex];
      visibleImage.visible = true;
      visibleImages[beat] = visibleImage;
    };

    const checkCountAndUpdateSpeed = (measures: number) => {
      const increment = 0.1 * Math.floor(measures / 4);
      const newSpeed =
        MIN_SPEED + increment < MAX_SPEED ? MIN_SPEED + increment : MAX_SPEED;

      drumLoop.speed = newSpeed;
      speedText.change(newSpeed);
    };

    app.ticker.add(() => {
      const { progress } = drumLoopInstance;

      detectBeats(progress, {
        0: ({ measures }) => {
          console.log(progress, "0/4", measures);
          checkCountAndUpdateSpeed(measures);
          hideSprite(6 / 8);
        },
        [1 / 8]: () => {
          console.log(progress, "1/8");

          showSprite(1 / 8);
        },
        [2 / 8]: () => {
          console.log(progress, "1/4");

          // random show
          if (randomInt(2) === 0) {
            showSprite(2 / 8);
          }
        },
        [3 / 8]: () => {
          console.log(progress, "3/8");

          hideSprite(1 / 8);
        },
        [4 / 8]: () => {
          console.log(progress, "2/4");
          hideSprite(2 / 8);
        },
        [5 / 8]: () => {
          console.log(progress, "5/8");

          showSprite(5 / 8);
        },
        [6 / 8]: () => {
          console.log(progress, "3/4");

          // random show
          if (randomInt(2) === 0) {
            showSprite(6 / 8);
          }
        },
        [7 / 8]: () => {
          console.log(progress, "7/8");

          hideSprite(5 / 8);
        },
      });
    });
  };

  const onClickWindow = () => {
    hotkeys.unbind("s");
    window.removeEventListener("click", onClickWindow);
    console.log("start app");
    startApp();
  };
  hotkeys("s", () => {
    hotkeys.unbind("s");
    window.removeEventListener("click", onClickWindow);
    console.log("start app");
    startApp();
  });
  window.addEventListener("click", onClickWindow);

  return app;
};
