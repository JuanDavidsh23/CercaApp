import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import es from "./locales/es.json";

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguage = "es";

function resolveDeviceLanguage(): SupportedLanguage {
  const languageCode = Localization.getLocales().at(0)?.languageCode;

  return (
    SUPPORTED_LANGUAGES.find((language) => language === languageCode) ?? FALLBACK_LANGUAGE
  );
}

/** Maps a language to the locale used for currency and number formatting. */
export function localeForLanguage(language: string): string {
  return language === "en" ? "en-US" : "es-MX";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: resolveDeviceLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
} else {
  i18n.addResourceBundle("en", "translation", en, true, true);
  i18n.addResourceBundle("es", "translation", es, true, true);
}

export default i18n;
