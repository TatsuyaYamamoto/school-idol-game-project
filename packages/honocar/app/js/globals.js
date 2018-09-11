import { getCharacter } from "./storage";

export default {
  gameStage: null,
  gameScrean: null,
  gameScreenScale: null,
  loginPromise: null,
  isLogin: false,
  queue: null,
  playCharacter: getCharacter(),
  player: null,
  opponent: null,
  isSoundMute: false,
  imageObj: {},
  ssObj: {},
  soundObj: {},
  textObj: {},
  user: {
    id: "",
    name: "",
    iconUrl: ""
  }
};
