import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

import CustomIcons from 'legacy/components/CustomIcons';

import './style.scss';

const UnauthorizedSidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="unauthorized-sidebar">
      <div className="welcome-container">
        <Typography.Title level={5}>
          {t('common.beemedMembers')}
        </Typography.Title>
        <Typography.Text>{t('common.continueAsVisitor')}</Typography.Text>
        <div className="action-buttons">
          <Link className="signup" to="/register">
            {t('common.signUp')}
          </Link>
          <Link className="login" to="/login">
            {t('common.login')}
          </Link>
        </div>
      </div>
      <div className="info-container">
        <ul className="info-container--list">
          <li className="info-container--list-item">
            <CustomIcons
              type="members"
              className="info-container--list-item__icon"
            />
            <Typography.Text className="info-container--list-item__title">
              {t('common.beemedMembers')}
            </Typography.Text>
            <Typography.Text className="info-container--list-item__desc">
              {t('common.beemedMembersDesc')}
            </Typography.Text>
          </li>
          <li className="info-container--list-item">
            <CustomIcons
              type="medical"
              className="info-container--list-item__icon"
            />
            <Typography.Text className="info-container--list-item__title">
              {t('common.beemedMedical')}
            </Typography.Text>
            <Typography.Text className="info-container--list-item__desc">
              {t('common.beemedMedicalDesc')}
            </Typography.Text>
          </li>
          <li className="info-container--list-item">
            <CustomIcons
              type="network"
              className="info-container--list-item__icon"
            />
            <Typography.Text className="info-container--list-item__title">
              {t('common.beemedNetwork')}
            </Typography.Text>
            <Typography.Text className="info-container--list-item__desc">
              {t('common.beemedNetworkDesc')}
            </Typography.Text>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UnauthorizedSidebar;
