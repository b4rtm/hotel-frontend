import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './transations'

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: 'pl',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
