import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../assets/i18n/en.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  returnNull: false,
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en
  },
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
