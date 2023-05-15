import React, { memo, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import {
  forgotPassword as forgotPasswordAction,
  flushState as flushStateAction,
} from './actions';

// assets
import CustomIcons from 'legacy/components/CustomIcons';

// antd component
import { Form, Input, Button, Alert, Typography } from 'antd';


const ForgotPassword = ({
  // default props
  className,
  // core
  state,
  dispatch
}) => {
  const { error, loading, success } = state.ForgotPassword;

  const history = useHistory();
  const { t, i18n } = useTranslation();

  const handleForgotPassword = (values) => {
    dispatch(forgotPassword(values));
  };

  useEffect(() => {
    i18n.changeLanguage('en');

    const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
    if (currentUser) {
      history.push('/newsfeed');
    }

    return () => {
      dispatch(flushState());
    };
  }, []);

  // render function
  return (
    <div className="forgotPassword">
      <div className="auth-container">
        {success ? (
          <div className="forgotPassword--checkEmail">
            <CustomIcons type="email" />
            <Typography.Title
              level={3}
              className="forgotPassword--checkEmail__title"
            >
              {t('auth.checkYourEmail')}
            </Typography.Title>
            <Typography.Paragraph className="forgotPassword--checkEmail__description">
              {t('auth.checkYourEmailDesc')}
            </Typography.Paragraph>
            <Link to="/login" className="forgotPassword--checkEmail__loginBtn">
              {t('auth.goBackToLogin')}
            </Link>
            {error && (
              <Alert
                description={error}
                type="error"
                closable
                className="forgotPassword--checkEmail__error"
              />
            )}
          </div>
        ) : (
          <>
            <div className="forgotPassword--header">
              <Typography.Title level={1}>
                {t('auth.resetYourPassword')}
              </Typography.Title>
            </div>
            <Form
              name="forgotPasswordForm"
              className="forgotPassword--form"
              onFinish={handleForgotPassword}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label={t('auth.email')}
                rules={[
                  { required: true, message: t('common.requiredField') },
                  { type: 'email', message: t('common.validEmail') },
                ]}
              >
                <Input
                  placeholder={t('login.email')}
                  onInput={(e) =>
                    (e.target.value = e.target.value.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item noStyle>
                <Button
                  htmlType="submit"
                  className="forgotPassword--form__submit"
                  loading={loading}
                >
                  {t('auth.resetMyPassword')}
                </Button>
              </Form.Item>

              {error && (
                <Alert
                  message={t('common.error')}
                  description={error}
                  type="error"
                  closable
                  className="forgotPassword--form__error"
                />
              )}
            </Form>

            <div className="forgotPassword--extra">
              <Link className="forgotPassword--extra__login" to="/login">
                {t('auth.goBackToLogin')}
              </Link>
              <p className="forgotPassword--extra__text">
                <span>{t('auth.notAMember')}</span>
              </p>
              <Link
                className="forgotPassword--extra__registerBtn"
                to="/register"
              >
                {t('auth.createAccount')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default compose(withRedux, memo)(ForgotPassword);
