/**
 * ユーザーのドラッグ操作を表すクラス
 * ｘ軸は画面下方向、y軸は画面右方向
 */
export default class ThrowAction {
  constructor() {
    this.startX = null;
    this.startY = null;
    this.endX = null;
    this.endY = null;
  }

  getAngle() {
    let displacementY = this.endY - this.startY;
    let displacementX = this.endX - this.startX;
    return Math.atan2(displacementY, displacementX);
  }
}
