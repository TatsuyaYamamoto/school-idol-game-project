import globals from "../globals";
import config from "../resources/config";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import { to } from "../stateMachine";
import { tracePage, TRACK_PAGES } from "../tracker";

class CreditEngine extends Engine {
  init() {
    super.init();

    tracePage(TRACK_PAGES.CREDIT);

    const { gameStage, imageObj, textObj } = globals;

    gameStage.removeAllChildren();
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.BUTTON_BACK_TOP_FROM_CREDIT);
    gameStage.addChild(textObj.TEXT_LINK_ME);
    gameStage.addChild(textObj.TEXT_LINK_SAN);
    gameStage.addChild(textObj.TEXT_LINK_LOVELIVE);
    gameStage.addChild(textObj.TEXT_LINK_1);
    gameStage.addChild(textObj.TEXT_LINK_2);

    gameStage.update();

    textObj.TEXT_LINK_1.addEventListener("mousedown", onClickSoundEffect);
    textObj.TEXT_LINK_2.addEventListener("mousedown", onClickOnJin);
    textObj.TEXT_LINK_ME.addEventListener("mousedown", onClickSokontokoro);
    textObj.TEXT_LINK_SAN.addEventListener("mousedown", onClickSanzashi);
    imageObj.BUTTON_BACK_TOP_FROM_CREDIT.addEventListener(
      "mousedown",
      onClickBack
    );
  }

  tearDown() {
    const { textObj, imageObj } = globals;

    textObj.TEXT_LINK_1.removeEventListener("mousedown", onClickSoundEffect);
    textObj.TEXT_LINK_2.removeEventListener("mousedown", onClickOnJin);
    textObj.TEXT_LINK_ME.removeEventListener("mousedown", onClickSokontokoro);
    textObj.TEXT_LINK_SAN.removeEventListener("mousedown", onClickSanzashi);
    imageObj.BUTTON_BACK_TOP_FROM_CREDIT.removeEventListener(
      "mousedown",
      onClickBack
    );
  }
}

function onClickBack() {
  globals.soundObj.SOUND_BACK.play();

  to(MenuEngine);
}

function onClickSoundEffect() {
  window.location.href = config.link.soundeffect;
}

function onClickOnJin() {
  window.location.href = config.link.on_jin;
}

function onClickSokontokoro() {
  window.location.href = config.link.sokontokoro;
}

function onClickSanzashi() {
  window.location.href = config.link.sanzashi;
}

export default new CreditEngine();
