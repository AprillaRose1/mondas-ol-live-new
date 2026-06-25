import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

const resources = {
  de: { translation: de },
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
