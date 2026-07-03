import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { SUPPORTED_LNGS, FALLBACK_LNG, LANG_COOKIE } from './settings';

const resources = {
  de: { translation: de },
  en: { translation: en },
  fr: { translation: fr },
};

// Guard against double-init (module can evaluate more than once across the
// server render + client bundle).
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: [...SUPPORTED_LNGS],
      fallbackLng: FALLBACK_LNG,
      // Cookie is the source of truth so the server (root layout) and client
      // agree on the language — no first-paint flash, no hydration mismatch.
      detection: {
        order: ['cookie', 'navigator', 'htmlTag'],
        lookupCookie: LANG_COOKIE,
        caches: ['cookie'],
        cookieMinutes: 60 * 24 * 365,
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;
