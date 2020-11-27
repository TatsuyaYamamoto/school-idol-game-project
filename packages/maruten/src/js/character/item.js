import properties from "../static/properties.js";
import State from "../state.js";

/**
 * タイマーの残り時間を加算する
 */
export default class Item {
  constructor(x, y) {
    // 新しいimageインスタンスを作成する
    // Object.assignでdeepcopyしたインスタンスをcreatejsが読み込めない
    this.img = new createjs.Bitmap(State.object.image.ITEM_MICAN.image);

    this.img.x = x;
    this.img.y = y;

    this.img.regX = this.img.image.width / 2;
    this.img.regY = this.img.image.height / 2;
    this.img.scaleY = this.img.scaleX =
      State.screenScale * properties.image.ITEM_MICAN.scale;
    this.img.alpha = properties.image.ITEM_MICAN.alpha;

    this.collisionRadius =
      ((properties.spritesheet.YOSHIKO.frames.width *
        properties.spritesheet.YOSHIKO.scale) /
        2) *
      State.screenScale *
      1.2;

    // // デバッグ用当たり判定円
    // var g = new createjs.Graphics();
    // g.beginStroke("#000");
    // g.beginFill("#000");
    // g.drawCircle(this.img.x,this.img.y,this.collisionRadius);
    // var shape=new createjs.Shape(g);
    // State.gameStage.addChild(shape)
  }

  /**
   * 当たり判定半径内の座標かを判定する
   * @param targetX
   * @param targetY
   * @returns {boolean}
   */
  doseColideWithFeather(feather) {
    let distanceX = this.img.x - feather.img.x;
    let distanceY = this.img.y - feather.img.y;
    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

    return distance < this.collisionRadius;
  }

  /**
   * 羽が当たり堕天するモーションを開始する
   */
  hit() {
    createjs.Tween.get(this.img)
      .wait(200)
      .to({ alpha: 0 }, 200)
      .call(function () {});
  }
}
