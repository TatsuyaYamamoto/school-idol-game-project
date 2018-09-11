import globals from "../globals";

function Player(playCharacter) {
  const { ssObj } = globals;

  switch (playCharacter) {
    case "honoka":
      this.img = ssObj.PLAYER_HONOKA_SS;
      break;
    case "kotori":
      this.img = ssObj.PLAYER_KOTORI_SS;
      break;
    case "erichi":
      this.img = ssObj.PLAYER_ERICHI_SS;
      break;
  }

  //レーンナンバー
  this.lane = 1;
  this.img.x = this.checkLane();
  this.img.gotoAndPlay("kihon");
}
Player.prototype.checkLane = function() {
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

Player.prototype.moveRight = function() {
  createjs.Tween.get(this.img)
    .call(this.img.gotoAndPlay, ["escapeR"])
    .to({ x: this.checkLane() }, 100);
};
Player.prototype.moveLeft = function() {
  createjs.Tween.get(this.img)
    .call(this.img.gotoAndPlay, ["escapeL"])
    .to({ x: this.checkLane() }, 100);
};

Player.prototype.howToMove = function() {
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
