// src/i18n/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import fr from "../locales/fr.json";
import en from "../locales/en.json";
import es from "../locales/es.json"
import de from "../locales/de.json"

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
};

const locales = Localization.getLocales();

let deviceLanguage = "en";

if (locales && locales.length > 0) {
  const tag = locales[0].languageTag;
  if (tag && typeof tag === "string") {
    deviceLanguage = tag.split("-")[0];
  }
}


i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage === "fr" ? "fr" : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  // IMPORTANT : pour pouvoir utiliser des clés comme "profile:login:title"
  keySeparator: false,
  ns: ["translation"],
  defaultNS: "translation",
  // plus de compatibilityJSON: "v3"
  react: {
    useSuspense: false
  }
});

export default i18n;
