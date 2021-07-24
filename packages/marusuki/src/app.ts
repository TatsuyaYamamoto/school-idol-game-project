import * as PIXI from "pixi.js";
import hotkeys from "hotkeys-js";
import { sound, SoundMap } from "@pixi/sound";

const loadSound = (): Promise<SoundMap> => {
  return new Promise((resolve) => {
    const soundMap = sound.add(
      {
        pa: "assets/sounds/pa.mp3",
        pon: "assets/sounds/pon.mp3",
        drum_loop: "assets/sounds/drum_loop.wav",
      },
      { preload: true }
    );
    resolve(soundMap);
  });
};

const loadSprite = (
  loader: PIXI.loaders.Loader
): Promise<PIXI.loaders.ResourceDictionary> => {
  [
    { name: "chisato", url: "assets/images/chisato.png" },
    { name: "takoyaki", url: "assets/images/takoyaki.png" },
  ].forEach(({ name, url }) => {
    loader.add(name, url);
  });

  return new Promise((resolve) => {
    loader.load((_loader, resources) => {
      resolve(resources);
    });
  });
};

const randomInt = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

const between = (min: number, target: number, max: number) => {
  return min < target && target < max;
};

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

  const soundMap = await loadSound();
  const spriteMap = await loadSprite(app.loader);

  const upperRight = new PIXI.Sprite(spriteMap.takoyaki.texture);
  upperRight.x = 500;
  upperRight.y = 1;
  upperRight.visible = false;
  const upperLeft = new PIXI.Sprite(spriteMap.takoyaki.texture);
  upperLeft.x = 10;
  upperLeft.y = 10;
  upperLeft.visible = false;
  const lowerRight = new PIXI.Sprite(spriteMap.takoyaki.texture);
  lowerRight.x = 500;
  lowerRight.y = 500;
  lowerRight.visible = false;
  const lowerLeft = new PIXI.Sprite(spriteMap.takoyaki.texture);
  lowerLeft.x = 2;
  lowerLeft.y = 500;
  lowerLeft.visible = false;
  const counterText = new PIXI.Text("0");
  counterText.x = 400;
  counterText.y = 20;

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

  hotkeys("s", () => {
    hotkeys.unbind("s");
    console.log("start app");

    const countUp = () => {
      const current = parseInt(counterText.text, 10);
      counterText.text = String(current + 1);
    };

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
  });

  return app;
};
