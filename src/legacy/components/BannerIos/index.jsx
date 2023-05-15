import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BeeMedLogo } from 'legacy/components/CustomIcons/logo';
import './style.scss';
import { Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const BannerIos = ({ clickUrl, closeModal }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
      window.location.href =
        'https://apps.apple.com/en/app/beemed/id1588569081';
    }

    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.beemed.app';
    }
    clickUrl();
  };

  return (
    <div className="banner-ios">
      <div className="banner-ios--left">
        <CloseOutlined onClick={() => closeModal()} />
        <BeeMedLogo className="logoClient" />
        <div className="banner-ios--left__text">
          <Typography.Text className="banner-ios--left__text-appname">
            BeeMed
          </Typography.Text>
          <Typography.Text className="banner-ios--left__text-desc">
            {t('common.openBeemedApp')}
          </Typography.Text>
        </div>
      </div>
      <Button onClick={handleClick}>{t('common.open')}</Button>
    </div>
  );
};

export default memo(BannerIos);
