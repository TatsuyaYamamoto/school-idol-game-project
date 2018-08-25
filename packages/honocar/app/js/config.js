// 設定ファイル---------------------------------
var apiServerOrigin = "http://api.sokontokoro-factory.net";
var contextPath = "/lovelive";

var config = {
  system: {
    FPS: 30,
    gamescrean: {
      width: 640,
      height: 896
    },
    car: {
      width: 135,
      height: 169,
      fasterSpeed: 1600,
      slowerSpeed: 2000
    },
    anime: {
      registrationFeedTime: 500
    },
    difficultyLength: 0.3
  },
  api: {
    login:
      apiServerOrigin + contextPath + "/auth/twitter/login?redirect=honocar",
    logout: apiServerOrigin + contextPath + "/auth/twitter/logout/",
    score: apiServerOrigin + contextPath + "/scores/honocar/me/",
    playlog: apiServerOrigin + contextPath + "/scores/honocar/playlog/",
    user: apiServerOrigin + contextPath + "/users/me/"
  },
  link: {
    t28_twitter: "https://twitter.com/t28_tatsuya",
    sokontokoro: "http://sokontokoro-factory.net",
    sanzashi: "https://twitter.com/xxsanzashixx",
    soundeffect: "http://soundeffect-lab.info/",
    on_jin: "http://on-jin.com/"
  }
};

//定数----------------------------------------

var properties = {
  image: {
    TITLE_LOGO: {
      id: "TITLE_LOGO",
      ratioX: 0.5,
      ratioY: 0.5,
      scale: 1,
      alpha: 1
    },
    TITLE_LOGO_E: {
      id: "TITLE_LOGO_E",
      ratioX: 0.5,
      ratioY: 0.5,
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
    GAMEOVER: {
      id: "GAMEOVER",
      ratioX: 0.5,
      ratioY: 0.35,
      scale: 1,
      alpha: 1
    },
    GAME_BACKGROUND: {
      id: "GAME_BACKGROUND",
      ratioX: 0.5,
      ratioY: 0.5,
      scale: 1,
      alpha: 1
    },
    WHITE_SHEET: {
      id: "WHITE_SHEET",
      ratioX: 0.5,
      ratioY: 0.5,
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
    BUTTON_HOW_TO: {
      id: "BUTTON_HOW_TO",
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
    BUTTON_BACK_TOP: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.7,
      ratioY: 0.75,
      scale: 1,
      alpha: 1
    },
    BUTTON_BACK_TOP_FROM_CREDIT: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.5,
      ratioY: 0.9,
      scale: 1,
      alpha: 1
    },
    BUTTON_BACK_TOP_FROM_HOW_TO: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.5,
      ratioY: 0.9,
      scale: 1,
      alpha: 1
    },
    BUTTON_BACK_TOP_FROM_RANKING: {
      id: "BUTTON_BACK_MENU",
      ratioX: 0.5,
      ratioY: 0.9,
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
    BUTTON_LEFT: {
      id: "BUTTON_LEFT",
      ratioX: 0.2,
      ratioY: 0.9,
      scale: 1,
      alpha: 0.5
    },
    BUTTON_RIGHT: {
      id: "BUTTON_RIGHT",
      ratioX: 0.8,
      ratioY: 0.9,
      scale: 1,
      alpha: 0.5
    },
    BUTTON_LEFT_HOW_TO: {
      id: "BUTTON_LEFT",
      ratioX: 0.2,
      ratioY: 0.9,
      scale: 1,
      alpha: 0.5
    },
    BUTTON_RIGHT_HOW_TO: {
      id: "BUTTON_LEFT",
      ratioX: 0.2,
      ratioY: 0.9,
      scale: 1,
      alpha: 0.5
    },
    BUTTON_TWITTER_TOP: {
      id: "TWITTER_TOP",
      ratioX: 0.2,
      ratioY: 0.1,
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
    BUTTON_REGISTRATION_RANKING: {
      id: "BUTTON_REGISTRATION_RANKING",
      ratioX: 0.75,
      ratioY: 0.2,
      scale: 0.5,
      alpha: 1
    }
  },
  ss: {
    BUTTON_TWITTER_GAMEOVER_SS: {
      id: "TWITTER_GAMEOVER_SS",
      ratioX: 0.25,
      ratioY: 0.15,
      scale: 1,
      alpha: 1,
      frames: {
        width: 178,
        height: 139
      },
      animations: {
        honoka: {
          frames: 0
        },
        erichi: {
          frames: 1
        }
      },
      firstAnimation: "honoka"
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
    },
    BUTTON_CHANGE_CHARA: {
      id: "BUTTON_CHANGE_CHARA_SS",
      ratioX: 0.978,
      ratioY: 0.88,
      scale: 1,
      alpha: 1,
      frames: {
        width: 170,
        height: 242
      },
      animations: {
        honoka: {
          frames: 0
        },
        erichi: {
          frames: 1
        }
      },
      firstAnimation: "honoka"
    },
    PLAYER_HONOKA_SS: {
      id: "HONOKA_SS",
      ratioX: 3 / 8,
      ratioY: 0.45,
      scale: 1,
      alpha: 1,
      frames: {
        width: 186,
        height: 266
      },
      animations: {
        kihon: {
          frames: [0, 1],
          next: true,
          speed: 0.3
        },
        escapeR: {
          frames: [2, 3, 4],
          next: "kihon",
          speed: 0.8
        },
        escapeL: {
          frames: [4, 3, 2],
          next: "kihon",
          speed: 0.8
        },
        down: {
          frames: [5, 6],
          next: true,
          speed: 0.5
        }
      },
      firstAnimation: "kihon"
    },
    PLAYER_ERICHI_SS: {
      id: "ERICHI_SS",
      ratioX: 3 / 8,
      ratioY: 0.45,
      scale: 1,
      alpha: 1,
      frames: {
        width: 186,
        height: 266
      },
      animations: {
        kihon: {
          frames: [0, 1],
          next: true,
          speed: 0.3
        },
        escapeR: {
          frames: [2, 3, 4],
          next: "kihon",
          speed: 0.8
        },
        escapeL: {
          frames: [4, 3, 2],
          next: "kihon",
          speed: 0.8
        },
        down: {
          frames: [5, 6],
          next: true,
          speed: 0.5
        }
      },
      firstAnimation: "kihon"
    }
  },
  sound: {
    SOUND_OK: {
      id: "OK",
      canMute: true
    },
    SOUND_BACK: {
      id: "BACK",
      canMute: true
    },
    SOUND_KAIHI: {
      id: "KAIHI",
      canMute: true
    },
    SOUND_CRASH: {
      id: "CRASH",
      canMute: true
    },
    SOUND_PI1: {
      id: "PI1",
      canMute: true
    },
    SOUND_PI2: {
      id: "PI2",
      canMute: true
    },
    SOUND_SUSUME_LOOP: {
      id: "SUSUME_LOOP",
      canMute: true
    },
    SOUND_SUSUME_END: {
      id: "SUSUME_END",
      canMute: true
    },
    SOUND_ZENKAI: {
      id: "ZENKAI",
      canMute: true
    },
    SOUND_TURN_SWITCH: {
      id: "TURN_SWITCH",
      canMute: false
    }
  },
  text: {
    TEXT_START: {
      ratioX: 0.5,
      ratioY: 0.93,
      size: 0.05,
      family: "Courier",
      align: "center",
      lineHeight: 0.04
    },
    TEXT_HOW_TO: {
      ratioX: 0.5,
      ratioY: 0.12,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.04
    },
    TEXT_GAME_COUNT: {
      ratioX: 0.5,
      ratioY: 0.05,
      size: 0.06,
      family: "Impact",
      align: "left",
      lineHeight: 0.04
    },
    TETX_GAMESTART_COUNT: {
      ratioX: 0.5,
      ratioY: 0.7,
      size: 0.08,
      family: "Impact",
      align: "center",
      lineHeight: 0.07
    },
    TEXT_RANKING: {
      ratioX: 0.5,
      ratioY: 0.15,
      size: 0.05,
      family: "Arial",
      align: "center",
      lineHeight: 0.07
    },
    TEXT_LINK_ME: {
      ratioX: 0.5,
      ratioY: 0.15,
      size: 0.05,
      family: "Arial",
      align: "center",
      lineHeight: 0.07
    },
    TEXT_LINK_SAN: {
      ratioX: 0.5,
      ratioY: 0.3,
      size: 0.05,
      family: "Verdana",
      align: "center",
      lineHeight: 0.07
    },
    TEXT_LINK_1: {
      ratioX: 0.5,
      ratioY: 0.5,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05
    },
    TEXT_LINK_2: {
      ratioX: 0.5,
      ratioY: 0.6,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05
    },
    TEXT_LINK_LOVELIVE: {
      ratioX: 0.5,
      ratioY: 0.7,
      size: 0.04,
      family: "Courier",
      align: "center",
      lineHeight: 0.05
    },
    TEXT_REGISTRATION: {
      ratioX: 0.4,
      ratioY: 0.9,
      size: 0.04,
      family: "Courier",
      align: "center",
      color: "#ffffff",
      lineHeight: 0.1
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
var manifest = {
  image: [
    {
      id: "BUTTON_START",
      src: "img/BUTTON_START.png"
    },
    {
      id: "BUTTON_RESTART",
      src: "img/BUTTON_RESTART.png"
    },
    {
      id: "BUTTON_HOW_TO",
      src: "img/BUTTON_HOW_TO.png"
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
      id: "BUTTON_BACK_MENU",
      src: "img/BUTTON_BACK_MENU.png"
    },
    {
      id: "BUTTON_REGISTRATION_RANKING",
      src: "img/BUTTON_REGISTRATION_RANKING.png"
    },
    {
      id: "GAME_BACKGROUND",
      src: "img/GAME_BACKGROUND.png"
    },
    {
      id: "TITLE_LOGO",
      src: "img/TITLE_LOGO.png"
    },
    {
      id: "TITLE_LOGO_E",
      src: "img/TITLE_LOGO_E.png"
    },
    {
      id: "MENU_LOGO",
      src: "img/MENU_LOGO.png"
    },
    {
      id: "GAMEOVER",
      src: "img/GAMEOVER.png"
    },
    {
      id: "BUTTON_LEFT",
      src: "img/BUTTON_LEFT.png"
    },
    {
      id: "BUTTON_RIGHT",
      src: "img/BUTTON_RIGHT.png"
    },
    {
      id: "CAR1_FRONT",
      src: "img/CAR1_FRONT.png"
    },
    {
      id: "CAR1_BACK",
      src: "img/CAR1_BACK.png"
    },
    {
      id: "TWITTER_TOP",
      src: "img/TWITTER_TOP.png"
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
      id: "WHITE_SHEET",
      src: "img/WHITE_SHEET.png"
    }
  ],
  spriteImage: [
    {
      id: "BUTTON_SOUND_SS",
      src: "img/BUTTON_SOUND_SS.png"
    },
    {
      id: "HONOKA_SS",
      src: "img/HONOKA_SS.png"
    },
    {
      id: "ERICHI_SS",
      src: "img/ERICHI_SS.png"
    },
    {
      id: "BUTTON_CHANGE_CHARA_SS",
      src: "img/BUTTON_CHANGE_CHARA_SS.png"
    },
    {
      id: "TWITTER_GAMEOVER_SS",
      src: "img/TWITTER_GAMEOVER_SS.png"
    }
  ],
  sound: [
    {
      id: "OK",
      src: "sound/OK.mp3"
    },
    {
      id: "BACK",
      src: "sound/BACK.mp3"
    },
    {
      id: "KAIHI",
      src: "sound/moto_KAIHI.mp3"
    },
    {
      id: "CRASH",
      src: "sound/CRASH.mp3"
    },
    {
      id: "PI1",
      src: "sound/PI1.mp3"
    },
    {
      id: "PI2",
      src: "sound/PI2.mp3"
    },
    {
      id: "SUSUME_LOOP",
      src: "sound/SUSUME_LOOP.mp3"
    },
    {
      id: "SUSUME_END",
      src: "sound/SUSUME_END.mp3"
    },
    {
      id: "ZENKAI",
      src: "sound/ZENKAI.mp3"
    },
    {
      id: "TURN_SWITCH",
      src: "sound/TURN_SWITCH.mp3"
    }
  ],
  api: [
    {
      id: "TWITTER_ICON",
      src: ""
    }
  ]
};
