/**
 * @fileOverview Image resource manifest.
 * It's used to load with {@link AssetLoader#setImageManifest}
 */
import { ImageManifest } from "../../framework/AssetLoader";

export enum Ids {
  BACKGROUND_TOP,
  BACKGROUND_CLOUD,
  BACKGROUND_SKY,
  BACKGROUND_BEACH,

  BUTTON_MENU_SINGLE_PLAY_GAME_START,
  BUTTON_MENU_MULTI_PLAY_GAME_START,
  BUTTON_MENU_ONLINE_GAME,
  BUTTON_MENU_OFFLINE_GAME,
  BUTTON_MENU_HOW_TO_PLAY,
  BUTTON_MENU_CREDIT,
  BUTTON_MENU_BACK_TO_MENU,
  BUTTON_MENU_SELECT_CHARACTER,
  BUTTON_MENU_BACK,
  BUTTON_GAMEOVER_BACK_TO_TOP,
  BUTTON_GAMEOVER_RESTART,
  BUTTON_GAMEOVER_TWEET,
  BUTTON_LEVEL_BEGINNER,
  BUTTON_LEVEL_NOVICE,
  BUTTON_LEVEL_EXPERT,
  BUTTON_HOME,
  BUTTON_SOUND,

  CHARACTER_OIMO,

  CHARACTER_HANAMARU,
  CHARACTER_HANAMARU_CLOSEUP,
  CHARACTER_RUBY,
  CHARACTER_RUBY_CLOSEUP,

  CHARACTER_UCHICCHI,
  CHARACTER_UCHICCHI_CLOSEUP,
  CHARACTER_SHITAKE,
  CHARACTER_SHITAKE_CLOSEUP,
  CHARACTER_LITTLE_DAEMON,
  CHARACTER_LITTLE_DAEMON_CLOSEUP,
  CHARACTER_WATAAME,
  CHARACTER_WATAAME_CLOSEUP,
  CHARACTER_ENEMY_RUBY,
  CHARACTER_ENEMY_RUBY_CLOSEUP,

  LOGO_TITLE,
  LOGO_GAME_OVER,
  MENU_BOARD,
  SELECT_LEVEL_BOARD,
  SELECT_MULTI_MODE_BOARD,
  SIGNAL
}

const manifest: ImageManifest = {
  en: {
    [Ids.BACKGROUND_TOP]: "background_top.png",
    [Ids.BACKGROUND_CLOUD]: "background_cloud.png",
    [Ids.BACKGROUND_SKY]: "background_sky.png",
    [Ids.BACKGROUND_BEACH]: "background_beach.json",

    [Ids.BUTTON_MENU_SINGLE_PLAY_GAME_START]:
      "button_menu_single_play_game_start.png",
    [Ids.BUTTON_MENU_MULTI_PLAY_GAME_START]:
      "button_menu_multi_play_game_start.png",
    [Ids.BUTTON_MENU_ONLINE_GAME]: "button_menu_online_game.png",
    [Ids.BUTTON_MENU_OFFLINE_GAME]: "button_menu_offline_game.png",
    [Ids.BUTTON_MENU_HOW_TO_PLAY]: "button_menu_how_to_play.png",
    [Ids.BUTTON_MENU_CREDIT]: "button_menu_credit.png",
    [Ids.BUTTON_MENU_BACK_TO_MENU]: "button_menu_back_to_menu.png",
    [Ids.BUTTON_MENU_SELECT_CHARACTER]: "button_menu_select_character.png",
    [Ids.BUTTON_MENU_BACK]: "button_menu_back.png",
    [Ids.BUTTON_GAMEOVER_BACK_TO_TOP]: "button_gameover_back_to_top.png",
    [Ids.BUTTON_GAMEOVER_RESTART]: "button_gameover_restart.png",
    [Ids.BUTTON_GAMEOVER_TWEET]: "button_gameover_tweet.png",
    [Ids.BUTTON_LEVEL_BEGINNER]: "button_level_beginner.png",
    [Ids.BUTTON_LEVEL_NOVICE]: "button_level_novice.png",
    [Ids.BUTTON_LEVEL_EXPERT]: "button_level_expert.png",
    [Ids.BUTTON_HOME]: "button_home.png",
    [Ids.BUTTON_SOUND]: "button_sound.json",

    [Ids.CHARACTER_OIMO]: "character_oimo.json",

    [Ids.CHARACTER_HANAMARU]: "character_hanamaru.json",
    [Ids.CHARACTER_HANAMARU_CLOSEUP]: "character_hanamaru_closeup.png",
    [Ids.CHARACTER_RUBY]: "character_ruby.json",
    [Ids.CHARACTER_RUBY_CLOSEUP]: "character_ruby_closeup.png",

    [Ids.CHARACTER_UCHICCHI]: "character_uchicchi.json",
    [Ids.CHARACTER_UCHICCHI_CLOSEUP]: "character_uchicchi_closeup.png",
    [Ids.CHARACTER_SHITAKE]: "character_shitake.json",
    [Ids.CHARACTER_SHITAKE_CLOSEUP]: "character_shitake_closeup.png",
    [Ids.CHARACTER_LITTLE_DAEMON]: "character_little_daemon.json",
    [Ids.CHARACTER_LITTLE_DAEMON_CLOSEUP]:
      "character_little_daemon_closeup.png",
    [Ids.CHARACTER_WATAAME]: "character_wataame.json",
    [Ids.CHARACTER_WATAAME_CLOSEUP]: "character_wataame_closeup.png",
    [Ids.CHARACTER_ENEMY_RUBY]: "character_enemy_ruby.json",
    [Ids.CHARACTER_ENEMY_RUBY_CLOSEUP]: "character_enemy_ruby_closeup.png",

    [Ids.LOGO_TITLE]: "image_logo_title.png",
    [Ids.LOGO_GAME_OVER]: "image_logo_gameover.png",
    [Ids.MENU_BOARD]: "image_menu_board.png",
    [Ids.SELECT_LEVEL_BOARD]: "image_select_level_board.png",
    [Ids.SELECT_MULTI_MODE_BOARD]: "image_select_multi_mode_board.png",
    [Ids.SIGNAL]: "image_signal.png"
  },
  ja: {}
};

export default manifest;
