import { addAllEventListener } from "./common";
import manifest from "./resources/manifest";
import properties from "./resources/object-props";
import globals from "./globals";
import { topState } from "./stateMachine";

function loadAnimation() {
  const q = new createjs.LoadQueue();
  q.setMaxConnections(6);

  q.loadManifest([
    {
      id: "LOAD_KOTORI",
      src: "img/LOAD_KOTORI.png"
    }
  ]);

  q.addEventListener("complete", function() {
    var bitmap = new createjs.Bitmap(q.getResult("LOAD_KOTORI"));
    bitmap.scaleY = bitmap.scaleX = globals.gameScreenScale;

    bitmap.x = globals.gameScrean.width * 0.5;
    bitmap.y = globals.gameScrean.height * 0.5;
    bitmap.regX = bitmap.image.width / 2;
    bitmap.regY = bitmap.image.height / 2;

    createjs.Tween.get(bitmap, { loop: true }).to({ rotation: 360 }, 1000);

    globals.gameStage.removeAllChildren();
    globals.gameStage.addChild(bitmap);

    globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
      globals.gameStage.update();
    });
  });
}

export function loadContent() {
  //ロードアニメーション
  loadAnimation();

  globals.queue = new createjs.LoadQueue(false);
  globals.queue.installPlugin(createjs.Sound);
  globals.queue.setMaxConnections(6);
  globals.queue.addEventListener("complete", handleComplete);

  //マニフェストファイルを読み込む----------
  globals.queue.loadManifest(manifest.image);
  globals.queue.loadManifest(manifest.spriteImage);
  globals.queue.loadManifest(manifest.sound);
}

// ロードイベント -----------------------------------

function handleComplete() {
  globals.loginPromise.finally(function() {
    setImageContent();
    setSpriteSheetContents();
    setSoundContent();
    setTextContent();

    createjs.Ticker.removeEventListener("tick", globals.tickListener);

    addAllEventListener();
    topState();
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
    globals.imageObj.TWITTER_ICON = new createjs.Bitmap(user.iconURL);
    globals.imageObj.TWITTER_ICON.x =
      globals.gameScrean.width * properties.asyncImage.TWITTER_ICON.ratioX;
    globals.imageObj.TWITTER_ICON.y =
      globals.gameScrean.height * properties.asyncImage.TWITTER_ICON.ratioY;
    globals.imageObj.TWITTER_ICON.scaleY = imageObj.TWITTER_ICON.scaleX =
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

  globals.textObj.TEXT_START.text = "-Please tap on the display!-";

  globals.textObj.TEXT_RANKING.text = "ランキング機能(仮画面)\rだよー";

  globals.textObj.TEXT_LINK_ME.text =
    "プログラム、音楽、思いつき：T28\rhttp://sokontokoro-factory.net";

  globals.textObj.TEXT_LINK_SAN.text =
    "イラスト：さんざし\rhttps://twitter.com/xxsanzashixx";

  globals.textObj.TEXT_LINK_1.text =
    "効果音：効果音ラボ 樣\rhttp://soundeffect-lab.info/";

  globals.textObj.TEXT_LINK_2.text =
    "効果音：On-Jin ～音人～ 樣\rhttp://on-jin.com/";

  globals.textObj.TEXT_LINK_LOVELIVE.text =
    "プロジェクトラブライブ！\rhttp://www.lovelive-anime.jp";

  globals.textObj.TEXT_REGISTRATION.text = "ランキングシステム　通信完了！";
}
