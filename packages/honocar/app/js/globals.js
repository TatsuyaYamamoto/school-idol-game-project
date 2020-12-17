import { getCharacter } from "./storage";

export default {
  gameStage: null,
  gameScrean: null,
  gameScreenScale: null,
  queue: null,
  playCharacter: getCharacter(),
  player: null,
  opponent: null,
  isSoundMute: false,
  imageObj: {},
  ssObj: {},
  soundObj: {},
  textObj: {},
  loginUser: null,
};
