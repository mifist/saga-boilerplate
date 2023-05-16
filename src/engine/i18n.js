import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { getBaseApiUrl } from 'utils/capacitorHelper';

// import enJson from './translations/en.json';
// import arJson from './translations/ar.json';
// import esJson from './translations/es.json';
// import frJson from './translations/fr.json';
// import hiJson from './translations/hi.json';
// import deJson from './translations/de.json';
// import itJson from './translations/it.json';
// import ptJson from './translations/pt.json';
// import nlJson from './translations/nl.json';

// const resources = {
//   en: {
//     translation: enJson,
//   },
//   ar: {
//     translation: arJson,
//   },
//   es: {
//     translation: esJson,
//   },
//   fr: {
//     translation: frJson,
//   },
//   hi: {
//     translation: hiJson,
//   },
//   de: {
//     translation: deJson,
//   },
//   it: {
//     translation: itJson,
//   },
//   pt: {
//     translation: ptJson,
//   },
//   nl: {
//     translation: nlJson,
//   },
// };

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources,
    debug: true,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: `${getBaseApiUrl()}translations/{{lng}}`,
    },
    // lng: 'en',
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    // prefix: "@@@", // {{
    // suffix: "@@@" // }}
  });

export default i18n;
