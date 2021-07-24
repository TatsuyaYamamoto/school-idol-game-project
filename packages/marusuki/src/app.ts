import * as PIXI from "pixi.js";
import hotkeys from "hotkeys-js";
import { sound, IMediaInstance } from "@pixi/sound";

const soundMap = sound.add({
  pa: "assets/sounds/pa.mp3",
  pon: "assets/sounds/pon.mp3",
  drum_loop: "assets/sounds/drum_loop.wav",
});

const app = new PIXI.Application({
  backgroundColor: parseInt("#efefef".replace("#", ""), 16),
  autoStart: false,
});

const checkOnRhythm = (): boolean => {
  const drumLoop = soundMap.drum_loop;
  const beat = drumLoop.instances[0].progress;
  // eslint-disable-next-line yoda
  if (0.2 < beat && beat < 0.3) {
    return true;
  }
  // eslint-disable-next-line yoda
  if (0.7 < beat && beat < 0.8) {
    return true;
  }

  return false;
};

hotkeys("s", () => {
  console.log("s");
  hotkeys.unbind("s");

  hotkeys("q,z,o,m", (event) => {
    event.preventDefault();

    if (checkOnRhythm()) {
      sound.play("pa");
    } else {
      sound.play("pon");
    }
  });
  app.start();
  sound.play("drum_loop", { loop: true });
});

export default app;
