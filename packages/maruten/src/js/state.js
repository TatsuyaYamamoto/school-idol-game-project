import { CHARACTER } from "./static/constant.js";

export default {
  gameStage: null,
  gameScrean: null,
  screenScale: null,

  gameScore: 0,

  isSoundMute: false,

  playCharacter: CHARACTER.HANAMARU,

  firebaseInitPromise: null,

  user: {
    id: "",
    name: "",
    iconURL: ""
  },
  object: {
    image: {},
    spritesheet: {},
    sound: {},
    text: {}
  }
};
