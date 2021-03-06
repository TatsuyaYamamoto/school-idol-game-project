import { ViewContainer } from "@sokontokoro/mikan";

import BackGround from "../../../texture/containers/BackGround";

abstract class TopViewState extends ViewContainer {
  readonly _background: BackGround;

  constructor() {
    super();

    this._background = new BackGround();
    this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
  }

  protected get background(): BackGround {
    return this._background;
  }
}

export default TopViewState;
