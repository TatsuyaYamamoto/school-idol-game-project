/**
 * @fileOverview Image resource manifest.
 * It's used to load with {@link AssetLoader#setImageManifest}
 */
import { ImageManifest } from "../framework/AssetLoader";

export const Ids = {
  BACKGROUND: "BACKGROUND",
  BACKGROUND_MENU: "BACKGROUND_MENU",
  BACKGROUND_CREDIT: "BACKGROUND_CREDIT",

  LOGO_TITLE: "LOGO_TITLE",
  LOGO_GAMEOVER: "LOGO_GAMEOVER",
  LOGO_GAMEOVER_IMAGE: "LOGO_GAMEOVER_IMAGE",

  KOTORI_LEFT: "KOTORI_LEFT",
  KOTORI_RIGHT: "KOTORI_RIGHT",

  BUTTON_GAME_START: "BUTTON_GAME_START",
  BUTTON_GAME_RESTART: "BUTTON_GAME_RESTART",
  BUTTON_GO_BACK_HOME: "BUTTON_GO_BACK_HOME",
  BUTTON_GO_BACK_MENU: "BUTTON_GO_BACK_MENU",
  BUTTON_GO_HOW_TO_PLAY: "BUTTON_GO_HOW_TO_PLAY",
  BUTTON_GO_CREDIT: "BUTTON_GO_CREDIT",
  BUTTON_GO_RANKING: "BUTTON_GO_RANKING",
  BUTTON_GO_TWITTER_HOME: "BUTTON_GO_TWITTER_HOME",
  BUTTON_RESULT_TWEET: "BUTTON_RESULT_TWEET",
  BUTTON_SOUND: "BUTTON_SOUND",
  BUTTON_CHANGE_LANGUAGE: "BUTTON_CHANGE_LANGUAGE",
};

const manifest: ImageManifest = {
  en: {
    [Ids.BACKGROUND]: "background.png",
    [Ids.BACKGROUND_MENU]: "background_menu.png",
    [Ids.BACKGROUND_CREDIT]: "background_credit.png",

    [Ids.LOGO_TITLE]: "logo_title.png",
    [Ids.LOGO_GAMEOVER]: "logo_gameover.png",
    [Ids.LOGO_GAMEOVER_IMAGE]: "logo_gameover_image.png",

    [Ids.KOTORI_LEFT]: "kotori_left.png",
    [Ids.KOTORI_RIGHT]: "kotori_right.png",

    [Ids.BUTTON_GAME_START]: "button_game_start.png",
    [Ids.BUTTON_GAME_RESTART]: "button_game_restart.png",
    [Ids.BUTTON_GO_BACK_HOME]: "button_go_back_home.png",
    [Ids.BUTTON_GO_BACK_MENU]: "button_go_back_menu.png",
    [Ids.BUTTON_GO_HOW_TO_PLAY]: "button_go_how_to_play.png",
    [Ids.BUTTON_GO_CREDIT]: "button_go_credit.png",
    [Ids.BUTTON_GO_RANKING]: "button_go_ranking.png",
    [Ids.BUTTON_GO_TWITTER_HOME]: "button_go_twitter_home.png",
    [Ids.BUTTON_RESULT_TWEET]: "button_result_tweet.png",
    [Ids.BUTTON_SOUND]: "button_sound.png",
    [Ids.BUTTON_CHANGE_LANGUAGE]: "button_change_language.png",
  },
  ja: {
    [Ids.LOGO_TITLE]: "logo_title.ja.png",

    [Ids.BUTTON_GAME_RESTART]: "button_game_restart.ja.png",
    [Ids.BUTTON_GAME_START]: "button_game_start.ja.png",
    [Ids.BUTTON_GO_BACK_HOME]: "button_go_back_home.ja.png",
    [Ids.BUTTON_GO_BACK_MENU]: "button_go_back_menu.ja.png",
    [Ids.BUTTON_GO_CREDIT]: "button_go_credit.ja.png",
    [Ids.BUTTON_GO_HOW_TO_PLAY]: "button_go_how_to_play.ja.png",
    [Ids.BUTTON_RESULT_TWEET]: "button_result_tweet.ja.png",
  },
};

export default manifest;
