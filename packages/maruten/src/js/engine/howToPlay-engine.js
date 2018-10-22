import { tracePage } from "@sokontokoro/mikan";

import State from "../state.js";
import Util from "../util.js";
import GameEngine from "./game-engine.js";
import Enemy from "../character/enemy.js";
import { CHARACTER } from "../static/constant.js";
import { TRACK_PAGES } from "../static/config";

export default class HowToPlayEngine extends GameEngine {
  constructor(tick, callbackMenuGameState) {
    super(tick, callbackMenuGameState);
  }

  // @Override
  start() {
    tracePage(TRACK_PAGES.HOW_TO_PLAY);

    this.handleLinkButtonEventListener().add();

    const targetChildren = [
      State.object.image.BACKGROUND,
      State.object.image.ITEM_MICAN,
      State.object.text.INTRODUCTION_ITEM,
      this.player.img
    ];

    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        targetChildren.push(
          State.object.text.HOW_TO_PLAY,
          State.object.image.BUTTON_BACK_MENU_FROM_HOW
        );
        break;
      case CHARACTER.YOU:
        targetChildren.push(
          State.object.text.HOW_TO_PLAY_YOU,
          State.object.image.BUTTON_BACK_MENU_FROM_HOW_YOU
        );
        break;
    }

    Util.addChildren(targetChildren);

    this.appearYoshiko();

    // HowToPlayアニメーション開始
    this.tick.add(() => {
      this.process();
    });
  }

  // @Override
  process() {
    this.gameFrame++;
    if (this.gameFrame % 20 == 0) {
      if ((this.gameFrame / 20) % 2 == 0) {
        this.throwFeather((-Math.PI * 3) / 8);
      } else {
        this.throwFeather((-Math.PI * 5) / 8);
      }
    }
    if (this.gameFrame % 60 == 0) {
      this.appearYoshiko();
    }

    this.checkHit();

    State.gameStage.update();
  }

  // @Override
  checkHit() {
    if (this.enemy != null) {
      this.feathers.forEach(feather => {
        if (this.enemy.doseColideWithFeather(feather)) {
          this.enemy.hit();

          State.object.sound.DATEN.stop();
          State.object.sound.DATEN.play();

          this.enemy = null;
        }
      });
    }
  }

  // @Override
  appearYoshiko() {
    if (this.enemy == null) {
      let newYoshiko;
      switch (Math.floor(Math.random() * 2)) {
        case 0:
          newYoshiko = new Enemy(
            (gameScrean.width * 2) / 10,
            (gameScrean.height * 4) / 10
          );
          break;
        case 1:
          newYoshiko = new Enemy(
            (gameScrean.width * 8) / 10,
            (gameScrean.height * 4) / 10
          );
          break;
      }

      State.gameStage.addChild(newYoshiko.img);

      this.enemy = newYoshiko;
    }
  }

  /*******************************
   * 画面遷移ボタンイベント
   * @returns {{add: add, remove: remove}}
   */
  handleLinkButtonEventListener() {
    const backMenu = () => {
      State.object.sound.BACK.stop();
      State.object.sound.BACK.play();

      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      this.callbackState();
    };

    return {
      add: () => {
        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            State.object.image.BUTTON_BACK_MENU_FROM_HOW.addEventListener(
              "mousedown",
              backMenu
            );
            break;
          case CHARACTER.YOU:
            State.object.image.BUTTON_BACK_MENU_FROM_HOW_YOU.addEventListener(
              "mousedown",
              backMenu
            );
            break;
        }
      },
      remove: () => {
        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            State.object.image.BUTTON_BACK_MENU_FROM_HOW.removeAllEventListeners(
              "mousedown"
            );
            break;
          case CHARACTER.YOU:
            State.object.image.BUTTON_BACK_MENU_FROM_HOW_YOU.removeAllEventListeners(
              "mousedown"
            );
            break;
        }
      }
    };
  }
}
