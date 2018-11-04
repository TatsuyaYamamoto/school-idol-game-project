import { t, trackTiming } from "@sokontokoro/mikan";

import globals from "./globals";

import manifest from "./resources/manifest";
import properties from "./resources/object-props";
import { Ids } from "./resources/string";
import loadImageBase64 from "shakarin/src/js/imageBase64/loadImageBase64";

function update() {
  globals.gameStage.update();
}

export function loadContent() {
  const start = Date.now();
  const loadImage = getLoadImage();
  const loadText = getLoadText();

  return new Promise(resolve => {
    globals.gameStage.removeAllChildren();
    globals.gameStage.addChild(loadText);
    globals.gameStage.addChild(loadImage);

    globals.queue = new createjs.LoadQueue(false);
    globals.queue.installPlugin(createjs.Sound);
    globals.queue.setMaxConnections(6);
    globals.queue.addEventListener("complete", function() {
      globals.loginPromise.then(() => {
        setImageContent();
        setSpriteSheetContents();
        setSoundContent();
        setTextContent();

        createjs.Ticker.removeEventListener("tick", update);

        trackTiming("load", Date.now() - start, { category: "assets" });
        resolve();
      });
    });
    globals.queue.addEventListener("progress", event => {
      // ロード情報
      loadText.text = `loading...${Math.floor(event.loaded * 100)}%`;

      // 回転ことりちゃんプログレス
      loadImage.rotation = event.loaded * 360 * 4;
    });
    createjs.Ticker.addEventListener("tick", update);

    //マニフェストファイルを読み込む----------
    globals.queue.loadManifest(manifest.image);
    globals.queue.loadManifest(manifest.spriteImage);
    globals.queue.loadManifest(manifest.sound);
  });
}

//ロードしたコンテンツをセット------------------------------------------
function setImageContent() {
  for (var key in properties.image) {
    globals.imageObj[key] = new createjs.Bitmap(
      globals.queue.getResult(properties.image[key].id)
    );
    globals.imageObj[key].x =
      globals.gameScrean.width * properties.image[key].ratioX;
    globals.imageObj[key].y =
      globals.gameScrean.height * properties.image[key].ratioY;
    globals.imageObj[key].regX = globals.imageObj[key].image.width / 2;
    globals.imageObj[key].regY = globals.imageObj[key].image.height / 2;
    globals.imageObj[key].scaleY = globals.imageObj[key].scaleX =
      globals.gameScreenScale * properties.image[key].scale;
    globals.imageObj[key].alpha = properties.image[key].alpha;
  }

  if (globals.isLogin) {
    globals.imageObj.TWITTER_ICON = new createjs.Bitmap(globals.user.iconUrl);
    globals.imageObj.TWITTER_ICON.x =
      globals.gameScrean.width * properties.asyncImage.TWITTER_ICON.ratioX;
    globals.imageObj.TWITTER_ICON.y =
      globals.gameScrean.height * properties.asyncImage.TWITTER_ICON.ratioY;
    globals.imageObj.TWITTER_ICON.scaleY = globals.imageObj.TWITTER_ICON.scaleX =
      globals.gameScreenScale * properties.asyncImage.TWITTER_ICON.scale;
    globals.imageObj.TWITTER_ICON.alpha =
      properties.asyncImage.TWITTER_ICON.alpha;
  }
}

function setSpriteSheetContents() {
  for (var key in properties.ss) {
    var spriteSheet = new createjs.SpriteSheet({
      images: [globals.queue.getResult(properties.ss[key].id)],
      frames: properties.ss[key].frames,
      animations: properties.ss[key].animations
    });

    globals.ssObj[key] = new createjs.Sprite(
      spriteSheet,
      properties.ss[key].firstAnimation
    );
    globals.ssObj[key].x = globals.gameScrean.width * properties.ss[key].ratioX;
    globals.ssObj[key].y =
      globals.gameScrean.height * properties.ss[key].ratioY;
    globals.ssObj[key].regX = properties.ss[key].frames.width / 2;
    globals.ssObj[key].regY = properties.ss[key].frames.height / 2;
    globals.ssObj[key].scaleY = globals.ssObj[key].scaleX =
      globals.gameScreenScale;
  }
}

function setSoundContent() {
  for (var key in properties.sound) {
    globals.soundObj[key] = createjs.Sound.createInstance(
      properties.sound[key].id
    );
  }
}

export function soundTurnOff() {
  globals.isSoundMute = true;
  for (var key in globals.soundObj) {
    if (properties.sound[key].canMute) {
      globals.soundObj[key].muted = true;
    }
  }
}

export function soundTurnOn() {
  globals.isSoundMute = false;
  for (var key in globals.soundObj) {
    if (properties.sound[key].canMute) {
      globals.soundObj[key].muted = false;
    }
  }
}

export function setTextProperties(target, x, y, size, family, align, height) {
  target.x = x;
  target.y = y;
  target.font = size + "px " + family;
  target.textAlign = align;
  target.lineHeight = height;
}

function setTextContent() {
  for (var key in properties.text) {
    globals.textObj[key] = new createjs.Text();
    globals.textObj[key].x =
      globals.gameScrean.width * properties.text[key].ratioX;
    globals.textObj[key].y =
      globals.gameScrean.height * properties.text[key].ratioY;
    globals.textObj[key].font =
      globals.gameScrean.width * properties.text[key].size +
      "px " +
      properties.text[key].family;
    globals.textObj[key].color = properties.text[key].color;
    globals.textObj[key].textAlign = properties.text[key].align;
    globals.textObj[key].lineHeight =
      globals.gameScrean.width * properties.text[key].lineHeight;
  }

  globals.textObj.TEXT_START.text = t(Ids.TAP_DISPLAY_INFO);

  globals.textObj.TEXT_LINK_ME.text = t(Ids.LINK_ME);

  globals.textObj.TEXT_LINK_SAN.text = t(Ids.LINK_SANZASHI);

  globals.textObj.TEXT_LINK_1.text = t(Ids.LINK_SOUND_EFFECT);

  globals.textObj.TEXT_LINK_2.text = t(Ids.LINK_ONJIN);

  globals.textObj.TEXT_LINK_LOVELIVE.text = t(Ids.LINK_LOVELIVE);

  globals.textObj.TEXT_APP_VERSION.text =
    "v" + require("../../package.json").version;
}

function getLoadImage() {
  const loadImage = new createjs.Bitmap(loadImageBase64);
  loadImage.scaleY = loadImage.scaleX = globals.gameScreenScale * 0.5;
  loadImage.x = globals.gameScrean.width * 0.5;
  loadImage.y = globals.gameScrean.height * 0.5;

  // 画像サイズ(固定値)の半分
  loadImage.regX = 147.5;
  loadImage.regY = 147.5;

  return loadImage;
}

function getLoadText() {
  const loadText = new createjs.Text();
  loadText.x = globals.gameScrean.width * 0.5;
  loadText.y = globals.gameScrean.height * 0.6;
  loadText.font = (globals.gameScrean.width * 1) / 20 + "px " + "Courier";
  loadText.textAlign = "center";

  return loadText;
}
