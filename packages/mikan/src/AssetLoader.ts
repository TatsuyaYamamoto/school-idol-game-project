/**
 * @fileOverview Resource loader class and util functions.
 * {@link AssetLoader} loads with manifest files.
 * The manifest file's construction is key, name of resource called in javascript , and value; actual file name.
 * URL of the resource is create with fileName and {@link IMAGE_BASE_DIR} or {@link SOUND_BASE_DIR}, when {@link AssetLoader} adds load list with manifest.
 * After completing to load assets, the loader set them to {@link AssetsCache}.
 * User can get assets cached in {@link AssetsCache} with {@link loadTexture} and {@link loadSound}.
 */

import { Texture, loaders } from "pixi.js";
import Sound from "pixi-sound/lib/Sound";

import { getCurrentLanguage } from "./i18n";
import config from "./config";

const IMAGE_BASE_DIR = "assets/image/";
const SOUND_BASE_DIR = "assets/sound/";

/**
 * Cache space of loaded resources.
 *
 * @type {any}
 * @private
 */
const assetsCache: {
  [key: string]: Asset;
} = Object.create(null);

/**
 * Texture and Sound resource interface loaded with PIXI Loader.
 */
export interface Asset extends loaders.Resource {
  sound: Sound;
}

/**
 * Image manifest interface that the loader requires.
 */
export interface ImageManifest {
  [language: string]: {
    [key: number]: any;
  };
}

/**
 * Sound manifest interface that the loader requires.
 */
export interface SoundManifest {
  [key: string]: any;
}

/**
 * Assets Loader for image and sound resources.
 * It should be set manifest before executing {@link this#load}.
 */
class AssetLoader extends loaders.Loader {
  constructor() {
    super();
    // TODO check spec
    // @ts-ignore
    this.on("complete", this.setAssets);
  }

  /**
   * Set image asset manifest for loader.
   *
   * @param {ImageManifest} imageManifest
   */
  public setImageManifest(imageManifest: ImageManifest): void {
    // Concat manifests with base and current language.
    const targetManifest: ImageManifest = Object.assign(
      {},
      imageManifest[config.defaultLanguage],
      imageManifest[getCurrentLanguage()]
    );

    // add each asset info to loader.
    const assetIds = Object.keys(targetManifest);
    assetIds.forEach((id) =>
      this.add({
        name: `image@${id}`,
        url: `${IMAGE_BASE_DIR}${targetManifest[id]}`,
      })
    );
  }

  /**
   * Set sound manifest for loader.
   *
   * @param {SoundManifest} soundManifest
   */
  public setSoundManifest(soundManifest: SoundManifest): void {
    // add each asset info to loader.
    const assetIds = Object.keys(soundManifest);
    assetIds.forEach((id) =>
      this.add({
        name: `sound@${id}`,
        url: `${SOUND_BASE_DIR}${soundManifest[id]}`,
      })
    );
  }

  /**
   * Fire on complete load resources.
   *
   * @param {AssetLoader} _loader
   * @param {{[string]: Asset}} assets
   * @private
   */
  private setAssets(_loader: AssetLoader, assets: { [key: string]: Asset }) {
    const assetIds = Object.keys(assets);

    assetIds.forEach((id) => {
      const asset = assets[id];
      assetsCache[asset.name] = asset;
    });
  }
}

/**
 * Convenience method for getting texture asset cached with the loader.
 *
 * @param {string} id
 * @returns {Texture}
 */
export function loadTexture(id: string | number): Texture {
  return assetsCache[`image@${id}`].texture;
}

/**
 * Convenience method for getting texture asset list for sprite sheet animation cached with the loader.
 *
 * @param {string} id
 * @returns {PIXI.Texture[]}
 */
export function loadFrames(id: string | number): Texture[] {
  const cache = assetsCache[`image@${id}`];
  const textures = cache.textures;

  if (!textures) {
    throw new Error("Fail to load cached assets. ID: " + id);
  }

  return Object.keys(textures).map((textureKey) => {
    return textures[textureKey];
  });
}

/**
 * Convenience method for getting sound asset cached with the loader.
 *
 * @param {string} id
 * @return {Sound}
 */
export function loadSound(id: string | number): Sound {
  return assetsCache[`sound@${id}`].sound;
}

export default AssetLoader;
