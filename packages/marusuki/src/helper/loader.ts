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

export type SpriteMap = { [key: string]: PIXI.ILoaderResource };

export const loadSprite = (
  sources: { [id: string]: string },
  onProgress: (progress: number) => void
): Promise<SpriteMap> => {
  const loader = new PIXI.Loader();
  Object.entries(sources).forEach(([id, url]) => {
    loader.add(id, url);
  });
  loader.onProgress.add(() => {
    onProgress(loader.progress);
  });

  return new Promise((resolve) => {
    loader.load((_loader, resources) => {
      resolve(resources);
    });
  });
};
