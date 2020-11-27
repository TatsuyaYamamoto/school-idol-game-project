import globals from "../globals";
import props from "../resources/object-props";

function Player(playCharacter) {
  const { ssObj } = globals;

  let img = null;
  switch (playCharacter) {
    case "kotori":
      img = ssObj.PLAYER_KOTORI_SS;
      break;
    case "eri":
      img = ssObj.PLAYER_ERICHI_SS;
      break;
    case "honoka":
    default:
      img = ssObj.PLAYER_HONOKA_SS;
      break;
  }

  /**
   * CreateJSのBitmapインスタンス
   */
  this.img = img;

  /**
   * このキャラクターが位置するレーンのindex(0-3)
   * @type {number}
   */
  this.lane = 1;

  /**
   * オンライン対戦用の半透明処理を実施しない
   */
  this.transparent(false);

  /**
   * kihonアニメーションを実行する
   */
  this.img.gotoAndPlay("kihon");

  /**
   * 初期位置
   */
  this.img.x = this.checkLane();
  this.img.y = globals.gameScrean.height * props.ss.PLAYER_HONOKA_SS.ratioY;
}

/**
 * オンライン対戦用
 * 半透明にする(isTransparent === true) or しない( isTransparent === false )
 *
 * @param isTransparent
 */
Player.prototype.transparent = function (isTransparent) {
  this.img.alpha = isTransparent ? 0.5 : 1;
};

Player.prototype.checkLane = function () {
  const { gameScrean } = globals;

  switch (this.lane) {
    case 0:
      return gameScrean.width / 8;
    case 1:
      return (gameScrean.width / 8) * 3;
    case 2:
      return (gameScrean.width / 8) * 5;
    case 3:
      return (gameScrean.width / 8) * 7;
  }
};

Player.prototype.moveRight = function () {
  createjs.Tween.get(this.img)
    .call(this.img.gotoAndPlay, ["escapeR"])
    .to({ x: this.checkLane() }, 100);
};
Player.prototype.moveLeft = function () {
  createjs.Tween.get(this.img)
    .call(this.img.gotoAndPlay, ["escapeL"])
    .to({ x: this.checkLane() }, 100);
};

Player.prototype.howToMove = function () {
  const { gameScrean } = globals;

  createjs.Tween.get(this.img, { loop: true })
    .call(this.img.gotoAndPlay, ["escapeR"])
    .to({ x: (gameScrean.width / 8) * 5 }, 100)
    .wait(500)
    .call(this.img.gotoAndPlay, ["escapeL"])
    .to({ x: (gameScrean.width / 8) * 3 }, 100)
    .wait(500);
};

export default Player;
