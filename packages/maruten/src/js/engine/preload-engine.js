import State from "../state.js";
import loadImageBase64 from "../imageBase64/loadImageBase64.js";
import properties from "../static/properties.js";
import manifest from "../static/manifest.js";
import BrandingAnimation from "../branding-animation.js";

import { DEBUG } from "../static/config.js";

export default class PreloadEngine {
  constructor(stateMachine) {
    this.tick = stateMachine.tick;
    this.callback = stateMachine.topState;

    this.queue = new createjs.LoadQueue();
  }

  /*****************************
   * ContentStateのエントリーメソッド
   */
  start() {
    const loadImage = PreloadEngine.getLoadImage();
    const loadText = PreloadEngine.getLoadText();
    const brandingAnimation = new BrandingAnimation({
      x: (State.gameScrean.width * 1) / 2,
      y: (State.gameScrean.height * 1) / 2,
      width: State.gameScrean.width,
      height: State.gameScrean.height,
      scale: State.screenScale
    });

    State.gameStage.removeAllChildren();
    State.gameStage.addChild(loadText);
    State.gameStage.addChild(loadImage);
    State.gameStage.addChild(brandingAnimation.container);

    this.queue.installPlugin(createjs.Sound);
    this.queue.setMaxConnections(6);

    this.queue.loadManifest(manifest.sound, false);
    this.queue.loadManifest(manifest.image, false);
    this.queue.loadManifest(manifest.spritesheet, false);

    /**
     * ロードプロセスイベント
     */
    this.queue.on("progress", event => {
      // ロード情報
      loadText.text = `loading...${Math.floor(event.loaded * 100)}%`;

      // 回転ことりちゃんプログレス
      loadImage.rotation = event.loaded * 360 * 4;
    });

    /**
     * ロード完了イベント
     */
    this.queue.on("complete", () => {
      // すべてのコンテンツに設定を付与する
      Object.keys(properties.spritesheet).forEach(key => {
        const prop = properties.spritesheet[key];
        const preloadResult = this.queue.getResult(prop.id);
        State.object.spritesheet[key] = PreloadEngine.getSpriteSheetContents(
          preloadResult,
          prop
        );
      });
      Object.keys(properties.sound).forEach(key => {
        State.object.sound[key] = PreloadEngine.getSoundContent(
          properties.sound[key]
        );
      });
      Object.keys(properties.text).forEach(key => {
        State.object.text[key] = PreloadEngine.getTextContent(
          properties.text[key]
        );
      });
      Object.keys(properties.image).forEach(key => {
        const prop = properties.image[key];
        const preloadResult = this.queue.getResult(prop.id);
        State.object.image[key] = PreloadEngine.getImageContent(
          preloadResult,
          prop
        );
      });

      const promiseList = DEBUG
        ? [State.firebaseInitPromise]
        : [State.firebaseInitPromise, brandingAnimation.promise];

      Promise.all(promiseList)
        .then(() => {
          Object.keys(properties.asyncImage).forEach(key => {
            State.object.image[key] = PreloadEngine.getAsyncImageContent(
              properties.asyncImage[key]
            );
          });
        })
        .catch(() => {})
        .then(() => {
          this.tick.remove();
          this.callback();
        });
    });

    /* 読み込み開始 */
    brandingAnimation.start();
    this.tick.add(() => {
      State.gameStage.update();
    });
    this.queue.load();
  }

  //ロードしたコンテンツをセット------------------------------------------
  static getImageContent(preloadResult, property) {
    var image = new createjs.Bitmap(preloadResult);
    image.x = State.gameScrean.width * property.ratioX;
    image.y = State.gameScrean.height * property.ratioY;
    image.regX = image.image.width / 2;
    image.regY = image.image.height / 2;
    image.scaleY = image.scaleX = State.screenScale * property.scale;
    image.alpha = property.alpha;
    image.rotation = property.rotation;
    return image;
  }

  static getAsyncImageContent(property) {
    var image = new createjs.Bitmap(property.url);
    image.x = State.gameScrean.width * property.ratioX;
    image.y = State.gameScrean.height * property.ratioY;
    image.scaleY = image.scaleX = State.screenScale * property.scale;
    image.alpha = property.alpha;

    return image;
  }

  static getSpriteSheetContents(preloadResult, property) {
    var spriteSheet = new createjs.SpriteSheet({
      images: [preloadResult],
      frames: property.frames,
      animations: property.animations
    });
    var ss = new createjs.Sprite(spriteSheet, property.firstAnimation);
    ss.x = State.gameScrean.width * property.ratioX;
    ss.y = State.gameScrean.height * property.ratioY;
    ss.regX = property.frames.width / 2;
    ss.regY = property.frames.height / 2;
    ss.scaleY = ss.scaleX = State.screenScale * property.scale;

    return ss;
  }

  static getSoundContent(property) {
    return createjs.Sound.createInstance(property.id);
  }
  static getTextContent(property) {
    var text = new createjs.Text();
    text.x = State.gameScrean.width * property.ratioX;
    text.y = State.gameScrean.height * property.ratioY;
    text.font =
      State.gameScrean.width * property.size + "px " + property.family;
    text.color = property.color;
    text.textAlign = property.align;
    text.lineHeight = State.gameScrean.width * property.lineHeight;
    text.text = property.text;
    text.rotation = property.rotation;

    return text;
  }

  static getLoadImage() {
    const loadImage = new createjs.Bitmap(loadImageBase64);
    loadImage.scaleY = loadImage.scaleX = State.screenScale * 0.5;
    loadImage.x = State.gameScrean.width * 0.2;
    loadImage.y = State.gameScrean.height * 0.9;
    loadImage.regX = loadImage.image.width * 0.5;
    loadImage.regY = loadImage.image.height * 0.5;

    return loadImage;
  }

  static getLoadText() {
    const loadText = new createjs.Text();
    loadText.x = State.gameScrean.width * 0.6;
    loadText.y = State.gameScrean.height * 0.9;
    loadText.font = (State.gameScrean.width * 1) / 20 + "px " + "Courier";
    loadText.textAlign = "center";

    return loadText;
  }
}
