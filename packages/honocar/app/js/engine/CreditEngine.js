import {
  openExternalSite,
  openModal,
  t,
  tracePage,
  trackEvent,
} from "@sokontokoro/mikan";

import globals from "../globals";
import config from "../resources/config";
import Engine from "./Engine";
import MenuEngine from "./MenuEngine";
import { to } from "../stateMachine";
import { TRACK_PAGES, TRACK_ACTION } from "../resources/config";
import { Ids } from "../resources/string";

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
    textObj.TEXT_LINK_ME.addEventListener("mousedown", onClickT28);
    textObj.TEXT_LINK_SAN.addEventListener("mousedown", onClickSanzashi);
    textObj.TEXT_LINK_LOVELIVE.addEventListener("mousedown", onClickLovelive);
    imageObj.BUTTON_BACK_TOP_FROM_CREDIT.addEventListener(
      "mousedown",
      onClickBack
    );
  }

  tearDown() {
    const { textObj, imageObj } = globals;

    textObj.TEXT_LINK_1.removeEventListener("mousedown", onClickSoundEffect);
    textObj.TEXT_LINK_2.removeEventListener("mousedown", onClickOnJin);
    textObj.TEXT_LINK_ME.removeEventListener("mousedown", onClickT28);
    textObj.TEXT_LINK_SAN.removeEventListener("mousedown", onClickSanzashi);
    textObj.TEXT_LINK_LOVELIVE.addEventListener("mousedown", onClickLovelive);
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
  showLinkDialog(config.link.soundeffect, "soundeffect-lab.info");
}

function onClickOnJin() {
  showLinkDialog(config.link.on_jin, "on-jin.com");
}

function onClickT28() {
  showLinkDialog(config.link.t28_twitter, "twitter.com");
}

function onClickSanzashi() {
  showLinkDialog(config.link.sanzashi, "twitter.com");
}

function onClickLovelive() {
  showLinkDialog(config.link.lovelive, "www.lovelive-anime.jp");
}

function showLinkDialog(url, displayDomain) {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  openModal({
    text: t(Ids.OPEN_EXTERNAL_SITE_INFO, {
      domain: displayDomain,
    }),
    actions: [
      {
        text: "OK",
        onClick: () => {
          globals.soundObj.SOUND_OK.stop();
          globals.soundObj.SOUND_OK.play();

          trackEvent(TRACK_ACTION.CLICK, { label: "credit_link" });
          openExternalSite(url);
        },
      },
      {
        text: "CANCEL",
        type: "cancel",
        onClick: () => {
          globals.soundObj.SOUND_BACK.stop();
          globals.soundObj.SOUND_BACK.play();
        },
      },
    ],
  });
}

export default new CreditEngine();
