const gameOrigin =
  process.env.NODE_ENV === "production"
    ? "https://games.sokontokoro-factory.net"
    : "https://games-dev.sokontokoro-factory.net";

export type Game =
  | "honocar"
  | "shakarin"
  | "maruten"
  | "yamidori"
  | "oimo-no-mikiri";

export interface GameDetail {
  url: string;
  imageUrl: string;
  name: {
    ja: string;
    en: string;
  };
}

export const GAMES: { [K in Game]: GameDetail } = {
  honocar: {
    url: `${gameOrigin}/honocar/`,
    imageUrl: `${gameOrigin}/honocar/img/TITLE_LOGO_HONOKA.png`,
    name: {
      ja: "ほのCar！",
      en: "Honocar!",
    },
  },
  shakarin: {
    url: `${gameOrigin}/shakarin/`,
    imageUrl: `${gameOrigin}/shakarin/img/TITLE_LOGO.png`,
    name: {
      ja: "しゃかりん！",
      en: "Shakarin!",
    },
  },
  maruten: {
    url: `${gameOrigin}/maruten/`,
    imageUrl: `${gameOrigin}/maruten/img/TITLE_LOGO_HANAMARU.png`,
    name: {
      ja: "まるてん！",
      en: "Maruten!",
    },
  },
  yamidori: {
    url: `${gameOrigin}/yamidori/`,
    imageUrl: `${gameOrigin}/yamidori/assets/image/ogp.jpg`,
    name: {
      ja: "やみどり！",
      en: "Yamidori!",
    },
  },
  "oimo-no-mikiri": {
    url: `${gameOrigin}/oimo/`,
    imageUrl: `${gameOrigin}/oimo/assets/image/ogp.png`,
    name: {
      ja: "おいものみきり！",
      en: "Oimo no Mikiri!",
    },
  },
};

type GameIds = ReadonlyArray<keyof typeof GAMES>;
export const gameIds = Object.keys(GAMES) as GameIds;

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
      en: "Honoka-chan",
    },
  },
  eri: {
    icon: `Я`,
    name: {
      ja: "えりちか",
      en: "Eri-chika",
    },
  },
  kotori: {
    icon: "🐤",
    name: {
      ja: "ことりちゃん",
      en: "Kotori-chan",
    },
  },
  umi: {
    icon: `🎯`,
    name: {
      ja: "うみちゃん",
      en: "Umi-chan",
    },
  },
  rin: {
    icon: `🐱`,
    name: {
      ja: "りんちゃん",
      en: "Rin-chan",
    },
  },
  maki: {
    icon: `⭐`,
    name: {
      ja: "まきちゃん",
      en: "Maki-chan",
    },
  },
  nozomi: {
    icon: `🌙`,
    name: {
      ja: "のぞみちゃん",
      en: "Nozomi-chan",
    },
  },
  hanayo: {
    icon: `🍚`,
    name: {
      ja: "かよちん",
      en: "Koyo-chin",
    },
  },
  nico: {
    icon: `😊︎`,
    name: {
      ja: "にこにー",
      en: "Niconi",
    },
  },

  // Aqours
  chika: {
    icon: `🍊`,
    name: {
      ja: "ちかちゃん",
      en: "Chika-chan",
    },
  },
  riko: {
    icon: `🎹`,
    name: {
      ja: "りこちゃん",
      en: "Riko-chan",
    },
  },
  kanan: {
    icon: `🐬`,
    name: {
      ja: "かなんちゃん",
      en: "Kanan-chan",
    },
  },
  dia: {
    icon: `🌺`,
    name: {
      ja: "ダイヤちゃん",
      en: "Dia-chan",
    },
  },
  you: {
    icon: `🚢`,
    name: {
      ja: "ようちゃん",
      en: "You-chan",
    },
  },
  yoshiko: {
    icon: `👿`,
    name: {
      ja: "<s>よしこ</s>ヨハネ",
      en: "<s>Yoshiko</s>Yohane",
    },
  },
  hanamaru: {
    icon: `💮`,
    name: {
      ja: "はなまるちゃん",
      en: "Hanamaru-chan",
    },
  },
  mari: {
    icon: `✨`,
    name: {
      ja: "マリちゃん",
      en: "Mari-chan",
    },
  },
  ruby: {
    icon: `🍭`,
    name: {
      ja: "ルビィちゃん",
      en: "Ruby-chan",
    },
  },
};

export function getMemberIcon(member: Member): string {
  return MEMBERS[member].icon;
}
