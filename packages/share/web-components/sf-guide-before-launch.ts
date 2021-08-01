import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import Bower from "bowser";

const browser = Bower.parse(window.navigator.userAgent);

const constants = {
  helpUrlJa: "https://games.sokontokoro-factory.net/portal/help/?hl=ja",
  helpUrlEn: "https://games.sokontokoro-factory.net/portal/help/?hl=en",
} as const;

const messages = {
  ja: {
    author: "produced by そこんところ工房",
    button: {
      preparing: "初期化中",
      ready: "起動する",
    },
    note: {
      label: "動作環境について",
      body: html`リリース時の最新OS(Android, iOS)、最新ブラウザ(Chrome,
        Safari)で動作確認をしています。<br />
        Twitter や LINE
        などのアプリ内ブラウザでは、正常に動作しない恐れがあります。<br />
        その他不明点がありましたら
        <a href="${constants.helpUrlJa}">ヘルプページ</a>
        を確認してください。`,
    },
    application: {
      label: "アプリケーション",
    },
    device: {
      label: "端末",
    },
    os: {
      label: "OS",
    },
    browser: {
      label: "ブラウザー",
    },
  },
  en: {
    author: "produced by Sokontokoro Factory",
    button: {
      preparing: "Initializing",
      ready: "Launch",
    },
    note: {
      label: "Operating environment",
      body: html`This game is tested on latest OS (Android, iOS) and latest
        browser (Chrome, Safari). <br />
        It may not work properly on In-app browser of Twitter, LINE and like.
        <br />
        If you have any question, please check out
        <a href="${constants.helpUrlEn}">help page</a>.`,
    },
    application: {
      label: "Application",
    },
    device: {
      label: "Device",
    },
    os: {
      label: "OS",
    },
    browser: {
      label: "Browser",
    },
  },
} as const;

const browserLanguage = navigator.language.split("-")[0];
const language = browserLanguage === "ja" ? "ja" : "en";

@customElement("sf-guide-before-launch")
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SfLaunchBeforeGuide extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: #888;
      text-align: center;
      max-width: 600px;

      font-family: "Rounded Mplus 1c";
    }

    .title {
      max-width: 250px;
      margin: 0 auto;

      position: relative;
      background: #fff0cd;
      box-shadow: 0 0 0 5px #fff0cd;
      border: dashed 2px white;
      padding: 0.2em 0.5em;
      color: #454545;
    }

    .title:after {
      position: absolute;
      content: "";
      right: -7px;
      top: -7px;
      border-width: 0 15px 15px 0;
      border-style: solid;
      border-color: #ffdb88 #fff #ffdb88;
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15);
    }

    .title .app-title__game-name {
      color: #555;
      font-size: 22px;
      font-weight: 300;
    }

    .title .app-title__author {
      font-size: 15px;
    }

    .action {
      margin-top: 30px;
    }

    .button {
      position: relative;
      display: inline-block;
      padding: 0.25em 0.5em;

      border-radius: 4px;
      box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2),
        0 2px 2px rgba(0, 0, 0, 0.19);

      font-weight: bold;
      text-decoration: none;
    }

    .button--initializing {
      color: rgba(255, 132, 0, 0.98);
      background: #fff;
      border: solid 1px #fd9535;
    }

    .button--ready {
      color: #fff;
      background: #fd9535;
      border: solid 1px #fd9535;
    }

    .button--ready:active {
      border-bottom: solid 2px #fd9535;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    }

    .note {
      margin-top: 30px;
    }
    .note .note__label {
      font-size: 14px;
      margin-top: 10px;
    }

    .note .note__body {
      font-size: 12px;
      margin-top: 5px;
    }

    .environment {
      margin-top: 30px;
    }

    .environment-item {
    }

    .environment-item__label {
    }

    .environment-item__value {
    }
  `;

  @property({ type: String, attribute: "app-version", reflect: true })
  private appVersion = "0.0.0";

  @property({ type: String, attribute: "app-name", reflect: true })
  private appName = "NAME";

  @property({ type: Boolean, reflect: true })
  private ready = false;

  render() {
    const message = messages[language];
    const button = this.ready ? message.button.ready : message.button.preparing;
    const appVersion = `v${this.appVersion}`;
    const deviceInfo = `${browser.platform.vendor} ${browser.os.name}`;
    const browserInfo = `${browser.browser.name} v${browser.browser.version}`;

    return html`
      <div class="title">
        <div class="app-title__game-name">${this.appName}</div>
        <div class="app-title__author">${message.author}</div>
      </div>

      <div class="action">
        <button
          class="${classMap({
            button: true,
            "button--initializing": !this.ready,
            "button--ready": this.ready,
          })}"
          ?disabled=${!this.ready}
          @click=${this._onClickButton}
        >
          ${button}
        </button>
      </div>

      <div class="note">
        <div class="note__label">${message.note.label}</div>
        <div class="note__body">${message.note.body}</div>
      </div>

      <div class="environment">
        <div class="environment-item">
          <span class="environment-item__label">
            ${`${message.application.label}: `}
          </span>
          <span class="environment-item__value">${appVersion}</span>
        </div>
        <div class="environment-item">
          <span class="environment-item__label">
            ${`${message.device.label}: `}
          </span>
          <span class="environment-item__value">${deviceInfo}</span>
        </div>
        <div class="environment-item">
          <span class="environment-item__label">
            ${`${message.browser.label}: `}
          </span>
          <span class="environment-item__value">${browserInfo}</span>
        </div>
      </div>
    `;
  }

  _onClickButton = () => {
    this.dispatchEvent(new CustomEvent("start"));
  };
}
