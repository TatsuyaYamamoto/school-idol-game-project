import { sound, SoundMap } from "@pixi/sound";
import * as PIXI from "pixi-v6";

export const loadSound = (sources: {
  [id: string]: string;
}): Promise<SoundMap> => {
  return new Promise((resolve) => {
    const soundMap = sound.add(sources, { preload: true });
    resolve(soundMap);
  });
};

export const loadSprite = <T extends string>(sources: {
  [id: string]: string;
}): Promise<
  {
    [key in T]: PIXI.ILoaderResource;
  }
> => {
  const loader = new PIXI.Loader();
  Object.entries(sources).forEach(([id, url]) => {
    loader.add(id, url);
  });

  return new Promise((resolve) => {
    loader.load((_loader, resources) => {
      resolve(resources);
    });
  });
};
