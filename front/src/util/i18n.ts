import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fi from '../../assets/i18n/fi.json';

i18n.use(initReactI18next).init({
  returnNull: false,
  lng: 'fi',
  fallbackLng: 'fi',
  resources: {
    fi
  },
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
