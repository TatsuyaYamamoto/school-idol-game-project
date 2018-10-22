import { CHARACTER } from "./static/constant.js";

export default {
  gameStage: null,
  gameScrean: null,
  screenScale: null,

  gameScore: 0,

  isSoundMute: false,

  playCharacter: CHARACTER.HANAMARU,

  loginUser: null,
  firebaseInitPromise: null,

  object: {
    image: {},
    spritesheet: {},
    sound: {},
    text: {}
  }
};
