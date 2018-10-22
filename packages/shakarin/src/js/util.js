import { properties } from "./config.js";
import State from "./state.js";

export default class Util {
  static initScreenScale(height, width) {
    var scale;
    if (window.innerHeight / window.innerWidth < height / width) {
      scale = window.innerHeight / height;
    } else {
      scale = window.innerWidth / width;
    }

    return scale;
  }

  static getScreen(elementId, height, width, scale) {
    var screen = document.getElementById(elementId);
    screen.height = height * scale;
    screen.width = width * scale;
    return screen;
  }

  static removeAllChildren() {
    State.gameStage.removeAllChildren();
  }

  static addChildren(array) {
    for (var key in array) {
      State.gameStage.addChild(array[key]);
    }
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
}
