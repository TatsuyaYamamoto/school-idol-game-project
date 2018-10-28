export type Member =
  // μ's
  | "honoka"
  | "eri"
  | "kotori"
  | "umi"
  | "rin"
  | "maki"
  | "nozomi"
  | "hanayo"
  | "nico"

  // aqours
  | "chika"
  | "riko"
  | "kanan"
  | "dia"
  | "you"
  | "yoshiko"
  | "hanamaru"
  | "mari"
  | "ruby";

export function getMemberIcon(member: Member): string {
  return MEMBERS[member].icon;
}

export interface MemberDetail {
  icon: string;
  name: {
    ja: string;
    en: string;
  };
}

export const MEMBERS: { [K in Member]: MemberDetail } = {
  // μ's
  honoka: {
    icon: `ほ`,
    name: {
      ja: "ほのかちゃん",
      en: "Honoka-chan"
    }
  },
  eri: {
    icon: `Я`,
    name: {
      ja: "えりちか",
      en: "Eri-chika"
    }
  },
  kotori: {
    icon: "🐤",
    name: {
      ja: "ことりちゃん",
      en: "Kotori-chan"
    }
  },
  umi: {
    icon: `🎯`,
    name: {
      ja: "うみちゃん",
      en: "Umi-chan"
    }
  },
  rin: {
    icon: `🐱`,
    name: {
      ja: "りんちゃん",
      en: "Rin-chan"
    }
  },
  maki: {
    icon: `⭐`,
    name: {
      ja: "まきちゃん",
      en: "Maki-chan"
    }
  },
  nozomi: {
    icon: `🌙`,
    name: {
      ja: "のぞみちゃん",
      en: "Nozomi-chan"
    }
  },
  hanayo: {
    icon: `🍚`,
    name: {
      ja: "かよちん",
      en: "Koyo-chin"
    }
  },
  nico: {
    icon: `😊︎`,
    name: {
      ja: "にこにー",
      en: "Niconi"
    }
  },

  // Aqours
  chika: {
    icon: `🍊`,
    name: {
      ja: "ちかちゃん",
      en: "Chika-chan"
    }
  },
  riko: {
    icon: `🎹`,
    name: {
      ja: "りこちゃん",
      en: "Riko-chan"
    }
  },
  kanan: {
    icon: `🐬`,
    name: {
      ja: "かなんちゃん",
      en: "Kanan-chan"
    }
  },
  dia: {
    icon: `🌺`,
    name: {
      ja: "ダイヤちゃん",
      en: "Dia-chan"
    }
  },
  you: {
    icon: `🚢`,
    name: {
      ja: "ようちゃん",
      en: "You-chan"
    }
  },
  yoshiko: {
    icon: `👿`,
    name: {
      ja: "<s>よしこ</s>ヨハネ",
      en: "<s>Yoshiko</s>Yohane"
    }
  },
  hanamaru: {
    icon: `💮`,
    name: {
      ja: "はなまるちゃん",
      en: "Hanamaru-chan"
    }
  },
  mari: {
    icon: `✨`,
    name: {
      ja: "マリちゃん",
      en: "Mari-chan"
    }
  },
  ruby: {
    icon: `🍭`,
    name: {
      ja: "ルビィちゃん",
      en: "Ruby-chan"
    }
  }
};
