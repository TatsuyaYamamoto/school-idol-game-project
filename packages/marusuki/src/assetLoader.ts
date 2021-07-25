import { sound, SoundMap } from "@pixi/sound";
import * as PIXI from "pixi.js";

export const loadSound = (
  sources: { id: string; url: string }[]
): Promise<SoundMap> => {
  return new Promise((resolve) => {
    const map = Object.fromEntries(sources.map(({ id, url }) => [id, url]));

    const soundMap = sound.add(map, { preload: true });
    resolve(soundMap);
  });
};

export const loadSprite = (
  loader: PIXI.loaders.Loader,
  sources: { name: string; url: string }[]
): Promise<PIXI.loaders.ResourceDictionary> => {
  sources.forEach(({ name, url }) => {
    loader.add(name, url);
  });

  return new Promise((resolve) => {
    loader.load((_loader, resources) => {
      resolve(resources);
    });
  });
};
