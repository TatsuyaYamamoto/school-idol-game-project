import * as PIXI from "pixi.js";
import hotkeys from "hotkeys-js";
import { sound } from "@pixi/sound";

import { loadSound, loadSprite } from "./assetLoader";
import { between, randomInt } from "./helper/utils";

const measureMap: { [key: string]: boolean } = {};
let measureCount = 0;
let prevProgress = Number.MAX_SAFE_INTEGER;

const detectBeats = (
  progress: number,
  params: { [beat: number]: () => void }
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

  if (targetBeat && params[targetBeat]) {
    params[targetBeat]();
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
    { id: "pa", url: "assets/sounds/pa.mp3" },
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

  const counterText = new PIXI.Text("0");
  counterText.x = 400;
  counterText.y = 20;

  const countUp = () => {
    const current = parseInt(counterText.text, 10);
    counterText.text = String(current + 1);
  };

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
      sound.play("pa");
      countUp();
    });
    return sprite;
  });

  gameContainer.addChild(upperLeft);
  gameContainer.addChild(upperRight);
  gameContainer.addChild(lowerLeft);
  gameContainer.addChild(lowerRight);
  gameContainer.addChild(counterText);

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
          sound.play("pa");
          countUp();
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "z") {
        if (lowerLeft.visible) {
          sound.play("pa");
          countUp();
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "o") {
        if (upperRight.visible) {
          sound.play("pa");
          countUp();
        } else {
          sound.play("pon");
        }
      }
      if (handler.key === "m") {
        if (lowerRight.visible) {
          sound.play("pa");
          countUp();
        } else {
          sound.play("pon");
        }
      }
    });
    app.start();
    sound.play("drum_loop", { loop: true });

    const drumLoop = soundMap.drum_loop;
    const drumLoopInstance = drumLoop.instances[0];

    const images = [upperLeft, upperRight, lowerLeft, lowerRight] as const;

    app.ticker.add(() => {
      const { progress } = drumLoopInstance;

      detectBeats(progress, {
        0.13: () => {
          images[randomInt(3)].visible = true;
        },
        0.25: () => {
          console.log(progress, "1/4");
        },
        0.37: () => {
          console.log(progress, "3/8");
          const target = images.find((image) => image.visible);
          if (target) {
            target.visible = false;
          }
        },
        0.63: () => {
          console.log(progress, "3/4");
          images[randomInt(3)].visible = true;
        },
        0.75: () => {
          console.log(progress, "3/4");
        },
        0.87: () => {
          console.log(progress, "7/8");
          const target = images.find((image) => image.visible);
          if (target) {
            target.visible = false;
          }
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
