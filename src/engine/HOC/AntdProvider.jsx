import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import moment from 'moment';

import en_US from 'antd/es/locale/en_US';
import ar_EG from 'antd/es/locale/ar_EG';
import es_ES from 'antd/es/locale/es_ES';
import fr_FR from 'antd/es/locale/fr_FR';
import hi_IN from 'antd/es/locale/hi_IN';
import de_DE from 'antd/es/locale/de_DE';
import it_IT from 'antd/es/locale/it_IT';
import pt_PT from 'antd/es/locale/pt_PT';
import nl_NL from 'antd/es/locale/nl_NL';

import 'moment/dist/locale/ar'; //arabic
import 'moment/dist/locale/es'; //spanish
import 'moment/dist/locale/fr'; //french
import 'moment/dist/locale/hi'; //hindi
import 'moment/dist/locale/de'; //german
import 'moment/dist/locale/it'; //italian
import 'moment/dist/locale/pt'; //portuguese
import 'moment/dist/locale/nl'; //dutch

moment.locale('fr');

ConfigProvider.config({
  theme: {
    primaryColor: '#005D72', // primary color for all components
    linkColor: '#005D72', // link color
    //fontFamily: 'Roboto', // link color
    // borderRadiusBase: '5px',
    // errorColor: '#ff4d4f',
    //warningColor: '#faad14',
    // successColor: '#52c41a',
    // infoColor: '#1890ff',
    //primaryColor: '#6ec1e4',
    //'primary-color': '#e7db18',

    //  fontFamily: 'Lato',
    //'font-family': 'Lato',
    // 'success-color': #52c41a' // success state color
    // 'warning-color': #faad14' // warning state color
    // 'error-color': #f5222d' // error state color
    // 'font-size-base': 14px' // major text font size
    // 'heading-color': rgba(0, 0, 0, 0.85)' // heading text color
    // 'text-color': rgba(0, 0, 0, 0.65)' // major text color
    // 'text-color-secondary': rgba(0, 0, 0, 0.45)' // secondary text color
    // 'disabled-color': rgba(0, 0, 0, 0.25)' // disable state color
    // 'border-color-base': '#661AFF',// major border color
    // 'box-shadow-base': 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    //   0 9px 28px 8px rgba(0, 0, 0, 0.05)' // major shadow for layers
  },
});

export const AntdProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const localeAntd = {
    en: en_US,
    ar: ar_EG,
    es: es_ES,
    fr: fr_FR,
    hi: hi_IN,
    de: de_DE,
    it: it_IT,
    pt: pt_PT,
    nl: nl_NL,
  };

  return (
    <ConfigProvider
      locale={localeAntd[i18n.language]}
      direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      {children}
    </ConfigProvider>
  );
};
