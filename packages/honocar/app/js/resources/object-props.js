export default {
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
