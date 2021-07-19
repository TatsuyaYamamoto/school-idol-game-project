import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ja from "../../public/assets/locales/ja/translation.json";
import en from "../../public/assets/locales/en/translation.json";

i18n.use(initReactI18next).init({
  lng: "ja",
  fallbackLng: "ja",
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  interpolation: {
    escapeValue: false,
  },
});
