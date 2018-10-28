import Sound from "pixi-sound/lib/Sound";
import { tracePage } from "@sokontokoro/mikan";

import ViewContainer from "../../../framework/ViewContainer";
import CountDownText from "../../../container/components/CountDownText";

import { dispatchEvent } from "../../../framework/EventUtils";
import { Events } from "../../view/GameViewState";

import { Ids } from "../../../resources/sound";
import { loadSound } from "../../../framework/AssetLoader";
import { TRACK_PAGES } from "../../../resources/tracker";

class CountGameState extends ViewContainer {
  public static TAG = "CountGameState";

  private _countInfo: CountDownText;

  private _isCountedOne: boolean = false;
  private _isCountedTwo: boolean = false;

  private _countLowSound: Sound;
  private _countHighSound: Sound;

  update(elapsedTimeMillis: number): void {
    super.update(elapsedTimeMillis);

    if (1000 < this.elapsedTimeMillis && !this._isCountedTwo) {
      console.log("Count down, 2!");
      this._countInfo.count = 2;
      this.applicationLayer.addChild(this._countInfo);
      this._countLowSound.play();
      this._isCountedTwo = true;
    }

    if (2000 < this.elapsedTimeMillis && !this._isCountedOne) {
      console.log("Count down, 1!");
      this._countInfo.count = 1;
      this._countLowSound.play();
      this._isCountedOne = true;
    }

    // is finished counting.
    if (
      3000 < this.elapsedTimeMillis &&
      this._isCountedOne &&
      this._isCountedTwo
    ) {
      console.log("Count down, done!");
      this._countHighSound.play();
      dispatchEvent(Events.GAME_START);
    }
  }

  onEnter(): void {
    super.onEnter();

    tracePage(TRACK_PAGES.GAME);

    this._countHighSound = loadSound(Ids.SOUND_COUNT_HIGH);
    this._countLowSound = loadSound(Ids.SOUND_COUNT_LOW);

    // Set deadline position.
    this._countInfo = new CountDownText();
    this._countInfo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
  }

  onExit(): void {
    super.onExit();
  }
}

export default CountGameState;
