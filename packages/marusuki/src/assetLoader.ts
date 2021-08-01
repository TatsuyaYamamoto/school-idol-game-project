import { sound, SoundMap } from "@pixi/sound";
import * as PIXI from "pixi-v6";

export const loadSound = (
  sources: { id: string; url: string }[]
): Promise<SoundMap> => {
  return new Promise((resolve) => {
    const map = Object.fromEntries(sources.map(({ id, url }) => [id, url]));

    const soundMap = sound.add(map, { preload: true });
    resolve(soundMap);
  });
};

export const loadSprite = <T extends string>(
  sources: { name: T; url: string }[]
): Promise<
  {
    [key in T]: PIXI.ILoaderResource;
  }
> => {
  const loader = new PIXI.Loader();
  sources.forEach(({ name, url }) => {
    loader.add(name, url);
  });

  return new Promise((resolve) => {
    loader.load((_loader, resources) => {
      resolve(resources);
    });
  });
};
