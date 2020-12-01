import { Container } from "pixi.js";
import { isSupportTouchEvent, trackEvent } from "@sokontokoro/mikan";

import Text from "../../internal/Text";
import { Action, Category } from "../../../helper/tracker";

class CreditItem extends Container {
  readonly _name: Text;

  readonly _url: Text;

  constructor(nameAndRole: string, url: string) {
    super();

    this._name = new Text(nameAndRole, {
      fontSize: 20,
    });
    this._name.y -= this._name.height * 0.5;
    this._url = new Text(url, {
      fontSize: 20,
    });
    this._url.y += this._url.height * 0.5;

    this.addChild(this._name, this._url);

    this.buttonMode = true;
    this.interactive = true;
    this.on(isSupportTouchEvent() ? "touchstart" : "click", () => {
      trackEvent(Action.TAP, {
        category: Category.BUTTON,
        label: `credit: ${url}`,
      });
      window.location.href = url;
    });
  }
}

export default CreditItem;
