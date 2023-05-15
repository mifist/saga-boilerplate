import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Select } from 'antd';
import classNames from 'classnames';

import { withUser } from 'appContext/User.context';

import { languages } from 'utils/categoryHelper';

import './style.scss';

const LanguageSelect = ({ user, className }) => {
  const { i18n } = useTranslation();

  return (
    <div className="language-container">
      <Select
        placement={
          user._id
            ? i18n.language == 'ar'
              ? 'bottomLeft'
              : 'bottomRight'
            : i18n.language === 'ar'
            ? 'bottomRight'
            : 'bottomLeft'
        }
        value={i18n.language}
        onChange={value => {
          i18n.changeLanguage(value);
          moment.locale(value);
          localStorage.setItem('cometchat:locale', value);
          if (user?._id) {
            user.onChangeState('language', value, null);
            user.patchUser();
          }
        }}
        className={classNames('languages-select', className)}
        getPopupContainer={trigger => trigger.parentElement}
        optionLabelProp="shortLabel"
        options={languages.map(language => ({
          label: language.translatedTitle,
          value: language.name,
          shortLabel: language.name.toUpperCase(),
        }))}
      />
    </div>
  );
};

export default memo(withUser(LanguageSelect));
