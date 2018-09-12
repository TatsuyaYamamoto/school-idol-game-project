import properties from "./static/properties.js";
import State from "./state.js";

export default class Util {
  static initScreenScale(height, width) {
    if (window.innerHeight / window.innerWidth < height / width) {
      return window.innerHeight / height;
    } else {
      return window.innerWidth / width;
    }
  }

  static getScreen(elementId, height, width) {
    var screen = document.getElementById(elementId);
    screen.height = height;
    screen.width = width;
    return screen;
  }

  static removeAllChildren() {
    State.gameStage.removeAllChildren();
  }

  static addChildren(array) {
    Object.keys(array).forEach(key => {
      State.gameStage.addChild(array[key]);
    });
  }

  static showText(text, x, y, size, family, align) {
    var textObj = new createjs.Text();
    textObj.x = x;
    textObj.y = y;
    textObj.font = size + "px " + family;
    textObj.textAlign = align;
    textObj.text = text;

    State.gameStage.addChild(textObj);
    State.gameStage.update();
  }

  static setTextProperties(target, x, y, size, family, align, height) {
    target.x = x;
    target.y = y;
    target.font = size + "px " + family;
    target.textAlign = align;
    target.lineHeight = height;
  }

  static soundTurnOff() {
    State.isSoundMute = true;
    Object.keys(State.object.sound).forEach(key => {
      if (properties.sound[key].canMute) {
        State.object.sound[key].muted = true;
      }
    });
  }

  static soundTurnOn() {
    State.isSoundMute = false;
    Object.keys(State.object.sound).forEach(key => {
      if (properties.sound[key].canMute) {
        State.object.sound[key].muted = false;
      }
    });
  }

  /**
   * min, maxの範囲のランダムな整数値を取得する
   *
   * @param min   最小の整数値
   * @param max   最大の整数値
   */
  static getRondom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
