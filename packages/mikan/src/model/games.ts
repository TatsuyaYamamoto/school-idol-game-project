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
      en: "Honocar!"
    }
  },
  shakarin: {
    url: `${gameOrigin}/shakarin/`,
    imageUrl: `${gameOrigin}/shakarin/img/TITLE_LOGO.png`,
    name: {
      ja: "しゃかりん！",
      en: "Shakarin!"
    }
  },
  maruten: {
    url: `${gameOrigin}/maruten/`,
    imageUrl: `${gameOrigin}/maruten/img/TITLE_LOGO_HANAMARU.png`,
    name: {
      ja: "まるてん！",
      en: "Maruten!"
    }
  },
  yamidori: {
    url: `${gameOrigin}/yamidori/`,
    imageUrl: `${gameOrigin}/yamidori/assets/image/ogp.jpg`,
    name: {
      ja: "やみどり！",
      en: "Yamidori!"
    }
  },
  "oimo-no-mikiri": {
    url: `${gameOrigin}/oimo/`,
    imageUrl: `${gameOrigin}/oimo/assets/image/ogp.png`,
    name: {
      ja: "おいものみきり！",
      en: "Oimo no Mikiri!"
    }
  }
};

export const gameIds = Object.keys(GAMES) as Game[];
