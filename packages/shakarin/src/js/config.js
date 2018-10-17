const wwwAuthority =
  process.env.NODE_ENV === "production"
    ? "//www.sokontokoro-factory.net"
    : "//www-dev.sokontokoro-factory.net";

const gamesAuthority =
  process.env.NODE_ENV === "production"
    ? "//games.sokontokoro-factory.net"
    : "//games-dev.sokontokoro-factory.net";

// 設定ファイル---------------------------------
export var config = {
  system: {
    FPS: 30,
    timeLength: 26000,
    gamescrean: {
      width: 640,
      height: 896
    },
    firstCheckFrame: 10
  },
  link: {
    homepage: `${wwwAuthority}/`,
    ranking: `${gamesAuthority}/#/ranking/shakarin`,
    t28_twitter: "https://twitter.com/t28_tatsuya",
    sokontokoro: "http://sokontokoro-factory.net",
    sanzashi: "https://twitter.com/xxsanzashixx",
    soundeffect: "http://soundeffect-lab.info/",
    on_jin: "http://on-jin.com/",
    lovelive: "http://www.lovelive-anime.jp/"
  }
};

//定数----------------------------------------

export var properties = {
  player: {
    RIN: "rin"
  },
  image: {
    TITLE_LOGO: {
      id: "TITLE_LOGO",
      ratioX: 0.5,
      ratioY: 0.5,
      scale: 1,
      alpha: 1
    },
    BACKGROUND: {
      id: "BACKGROUND",
      ratioX: 0.5,
      ratioY: 0.5,
      scale: 1,
      alpha: 1
    },
    GAMEOVER: {
      id: "GAMEOVER",
      ratioX: 0.5,
      ratioY: 0.35,
      scale: 1,
      alpha: 1
    },
    MENU_LOGO: {
      id: "MENU_LOGO",
      ratioX: 0.5,
      ratioY: 0.25,
      scale: 1,
      alpha: 1
    },
    BUTTON_LEFT: {
      id: "BUTTON_LR",
      ratioX: 0.1,
      ratioY: 0.6,
      scale: 1,
      alpha: 1
    },
    BUTTON_RIGHT: {
      id: "BUTTON_LR",
      ratioX: 0.9,
      ratioY: 0.6,
      scale: 1,
      alpha: 1
    },
    BUTTON_TOP: {
      id: "BUTTON_UD",
      ratioX: 0.48,
      ratioY: 0.3,
      scale: 1,
      alpha: 1
    },
    BUTTON_BOTTOM: {
      id: "BUTTON_UD",
      ratioX: 0.5,
      ratioY: 0.92,
      scale: 1,
      alpha: 1
    },
    RAMEN: {
      id: "RAMEN",
      ratioX: 0.1,
      ratioY: 0.12,
      scale: 1,
      alpha: 1
    },
    BUTTON_START: {
      id: "BUTTON_START",
      ratioX: 0.5,
      ratioY: 0.4,
      scale: 0.8,
      alpha: 1
    },
    BUTTON_HOW: {
      id: "BUTTON_HOW",
      ratioX: 0.5,
      ratioY: 0.54,
      scale: 0.8,
      alpha: 1
    },
    BUTTON_RANKING: {
      id: "BUTTON_RANKING",
      ratioX: 0.5,
      ratioY: 0.68,
      scale: 0.8,
      alpha: 1
    },
    BUTTON_CREDIT: {
      id: "BUTTON_CREDIT",
      ratioX: 0.5,
      ratioY: 0.82,
      scale: 0.8,
      alpha: 1
    },
    BUTTON_BACK_MENU_FROM_CREDIT: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.5,
      ratioY: 0.9,
      scale: 1,
      alpha: 1
    },
    BUTTON_BACK_MENU_FROM_HOW: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.15,
      ratioY: 0.9,
      scale: 1,
      alpha: 1
    },
    BUTTON_TWITTER_TOP: {
      id: "BUTTON_TWITTER_TOP",
      ratioX: 0.2,
      ratioY: 0.1,
      scale: 1,
      alpha: 1
    },
    BUTTON_TWITTER_GAMEOVER_RIN: {
      id: "BUTTON_TWITTER_GAMEOVER_RIN",
      ratioX: 0.2,
      ratioY: 0.15,
      scale: 1,
      alpha: 1
    },
    BUTTON_TWITTER_LOGIN: {
      id: "BUTTON_TWITTER_LOGIN",
      ratioX: 0.25,
      ratioY: 0.94,
      scale: 1,
      alpha: 1
    },
    BUTTON_TWITTER_LOGOUT: {
      id: "BUTTON_TWITTER_LOGOUT",
      ratioX: 0.4,
      ratioY: 0.94,
      scale: 1,
      alpha: 1
    },
    BUTTON_BACK_MENU_FROM_GAME: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.7,
      ratioY: 0.75,
      scale: 1,
      alpha: 1
    },
    BUTTON_RESTART: {
      id: "BUTTON_RESTART",
      ratioX: 0.3,
      ratioY: 0.75,
      scale: 1,
      alpha: 1
    },
    FLAG_START: {
      id: "FLAG_START",
      ratioX: 0.1,
      ratioY: 0.1,
      scale: 1,
      alpha: 1
    },
    FLAG_END: {
      id: "FLAG_END",
      ratioX: 0.9,
      ratioY: 0.1,
      scale: 1,
      alpha: 1
    }
  },
  ss: {
    RIN: {
      id: "SS_RIN",
      ratioX: 0.5,
      ratioY: 0.61,
      scale: 1,
      alpha: 1,
      frames: {
        width: 467,
        height: 467
      },
      animations: {
        N_wait: {
          frames: [0]
        },
        R_wait: {
          frames: [1]
        },
        R1: {
          frames: [2]
        },
        R2: {
          frames: [3]
        },
        L_wait: {
          frames: [4]
        },
        L1: {
          frames: [5]
        },
        L2: {
          frames: [6]
        },
        T_wait: {
          frames: [7]
        },
        T1: {
          frames: [8]
        },
        T2: {
          frames: [9]
        },
        B_wait: {
          frames: [10]
        },
        B1: {
          frames: [11]
        },
        B2: {
          frames: [12]
        },
        FINISH: {
          frames: [13, 14],
          next: true,
          speed: 0.12
        }
      },
      firstAnimation: "N_wait"
    },
    BUTTON_SOUND_SS: {
      id: "BUTTON_SOUND_SS",
      ratioX: 0.9,
      ratioY: 0.12,
      scale: 1,
      alpha: 1,
      frames: {
        width: 126,
        height: 118
      },
      animations: {
        on: {
          frames: [1, 2, 3],
          next: true,
          speed: 0.12
        },
        off: {
          frames: 0
        }
      },
      firstAnimation: "on"
    }
  },
  sound: {
    OK: {
      id: "SOUND_OK",
      canMute: true
    },
    BACK: {
      id: "SOUND_BACK",
      canMute: true
    },
    SHAKE: {
      id: "SOUND_SHAKE",
      canMute: true
    },
    GAME_LOOP: {
      id: "SOUND_GAME_LOOP",
      canMute: true
    },
    GAME_END: {
      id: "SOUND_GAME_END",
      canMute: true
    },
    ZENKAI: {
      id: "SOUND_ZENKAI",
      canMute: true
    },
    PI1: {
      id: "SOUND_PI1",
      canMute: true
    },
    PI2: {
      id: "SOUND_PI2",
      canMute: true
    },
    TURN_SWITCH: {
      id: "TURN_SWITCH",
      canMute: false
    }
  },
  text: {
    START: {
      ratioX: 0.5,
      ratioY: 0.93,
      size: 0.05,
      family: "Courier",
      align: "center",
      lineHeight: 0.04,
      text: "-Please tap on the display!-"
    },
    HOW_TO_PLAY: {
      ratioX: 0.5,
      ratioY: 0.05,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05,
      text:
        "マラカスの練習中のりんちゃん！\r上下左右のボタンを向いているときにタップして\rしゃかしゃかさせよう！\r(キーボードの↑↓←→でもOK!)"
    },
    SCORE_COUNT: {
      ratioX: 0.95,
      ratioY: 0.18,
      size: 0.05,
      family: "Courier",
      align: "right",
      lineHeight: 0.04,
      text: ""
    },
    GAMESTART_COUNT: {
      ratioX: 0.5,
      ratioY: 0.2,
      size: 0.1,
      family: "Impact",
      align: "center",
      lineHeight: 0.07,
      text: ""
    },
    LINK_SOKONTOKORO: {
      ratioX: 0.5,
      ratioY: 0.15,
      size: 0.05,
      family: "Arial",
      align: "center",
      lineHeight: 0.07,
      text: "プログラム、音楽、思いつき：T28\rhttp://sokontokoro-factory.net"
    },
    LINK_SANZASHI: {
      ratioX: 0.5,
      ratioY: 0.3,
      size: 0.05,
      family: "Verdana",
      align: "center",
      lineHeight: 0.07,
      text: "イラスト：さんざし\rhttps://twitter.com/xxsanzashixx"
    },
    LINK_SOUNDEFFECT: {
      ratioX: 0.5,
      ratioY: 0.5,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05,
      text: "効果音：効果音ラボ 樣\rhttp://soundeffect-lab.info/"
    },
    LINK_ONJIN: {
      ratioX: 0.5,
      ratioY: 0.6,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05,
      text: "効果音：On-Jin ～音人～ 樣\rhttp://on-jin.com/"
    },
    LINK_LOVELIVE: {
      ratioX: 0.5,
      ratioY: 0.7,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05,
      text: "プロジェクトラブライブ！\rhttp://www.lovelive-anime.jp"
    }
  },
  asyncImage: {
    TWITTER_ICON: {
      url: "",
      ratioX: 0.04,
      ratioY: 0.91,
      scale: 1.3,
      alpha: 1
    }
  }
};

// 画像、音声ファイル---------------------------------
export var manifest = {
  image: [
    {
      id: "TITLE_LOGO",
      src: "img/TITLE_LOGO.png"
    },
    {
      id: "BACKGROUND",
      src: "img/BACKGROUND.png"
    },
    {
      id: "MENU_LOGO",
      src: "img/MENU_LOGO.png"
    },
    {
      id: "BUTTON_START",
      src: "img/BUTTON_START.png"
    },
    {
      id: "BUTTON_HOW",
      src: "img/BUTTON_HOW.png"
    },
    {
      id: "BUTTON_CREDIT",
      src: "img/BUTTON_CREDIT.png"
    },
    {
      id: "BUTTON_RANKING",
      src: "img/BUTTON_RANKING.png"
    },
    {
      id: "BUTTON_LR",
      src: "img/BUTTON_LR.png"
    },
    {
      id: "BUTTON_UD",
      src: "img/BUTTON_UD.png"
    },
    {
      id: "BUTTON_TWITTER_TOP",
      src: "img/BUTTON_TWITTER_TOP.png"
    },
    {
      id: "RAMEN",
      src: "img/RAMEN.png"
    },
    {
      id: "GAMEOVER",
      src: "img/GAMEOVER.png"
    },
    {
      id: "BUTTON_BACK_MENU",
      src: "img/BUTTON_BACK_MENU.png"
    },
    {
      id: "BUTTON_RESTART",
      src: "img/BUTTON_RESTART.png"
    },
    {
      id: "BUTTON_TWITTER_LOGIN",
      src: "img/BUTTON_TWITTER_LOGIN.png"
    },
    {
      id: "BUTTON_TWITTER_LOGOUT",
      src: "img/BUTTON_TWITTER_LOGOUT.png"
    },
    {
      id: "BUTTON_TWITTER_GAMEOVER_RIN",
      src: "img/BUTTON_TWITTER_GAMEOVER_RIN.png"
    },
    {
      id: "FLAG_START",
      src: "img/FLAG_START.png"
    },
    {
      id: "FLAG_END",
      src: "img/FLAG_END.png"
    }
  ],
  ss: [
    {
      id: "SS_RIN",
      src: "img/SS_RIN.png"
    },
    {
      id: "BUTTON_SOUND_SS",
      src: "img/BUTTON_SOUND_SS.png"
    }
  ],
  sound: [
    {
      id: "SOUND_OK",
      src: "sound/OK.mp3"
    },
    {
      id: "SOUND_BACK",
      src: "sound/BACK.mp3"
    },
    {
      id: "SOUND_SHAKE",
      src: "sound/SHAKE.mp3"
    },
    {
      id: "SOUND_GAME_LOOP",
      src: "sound/GAME_LOOP.mp3"
    },
    {
      id: "SOUND_GAME_END",
      src: "sound/GAME_END.mp3"
    },
    {
      id: "SOUND_ZENKAI",
      src: "sound/ZENKAI.mp3"
    },
    {
      id: "SOUND_PI1",
      src: "sound/PI1.mp3"
    },
    {
      id: "SOUND_PI2",
      src: "sound/PI2.mp3"
    },
    {
      id: "TURN_SWITCH",
      src: "sound/TURN_SWITCH.mp3"
    }
  ],
  load: [
    {
      id: "LOAD_IMG",
      src: "img/LOAD_KOTORI.png"
    }
  ]
};
