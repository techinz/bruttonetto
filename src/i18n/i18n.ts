import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationDE from './translations/de.json';
import translationEN from './translations/en.json';
import translationRU from './translations/ru.json';
import translationUA from './translations/uk.json';

const resources = {
  de: {
    translation: translationDE
  },
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  },
  uk: {
    translation: translationUA
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // default language
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false // react does this
    },
    keySeparator: '>',
    nsSeparator: '|'
  });

export default i18n;