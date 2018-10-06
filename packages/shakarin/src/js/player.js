import State from "./state.js";

export default class Player {
  constructor() {
    switch (State.playCharacter) {
      case "rin":
        this.img = State.object.ss.RIN;
        break;
    }

    this.img.gotoAndPlay("N");
    this.direction = "N";
    this.wait();
  }

  shake(direction, shackCount) {
    State.object.sound.SHAKE.play("none", 0, 0, 0, 1, 0);
    var i = (shackCount % 2) + 1; // ex. L1 or L2
    this.img.gotoAndPlay(direction + i);
  }

  wait() {
    this.img.gotoAndPlay(this.direction + "_wait");
  }
  setDirection(direction) {
    this.direction = direction;
  }

  getDirection() {
    return this.direction;
  }
  changeDirection() {
    var lastDirection = this.direction;

    //ランダムに方向が決定
    var i = Math.floor(Math.random() * 4);
    switch (i) {
      case 0:
        this.direction = "L";
        break;
      case 1:
        this.direction = "R";
        break;
      case 2:
        this.direction = "T";
        break;
      case 3:
        this.direction = "B";
        break;
    }
    // directionに変更がなければwaitアニメなし
    if (this.direction !== lastDirection) {
      this.wait();
    }
  }

  finish() {
    this.img.gotoAndPlay("FINISH");
  }
}
