import React, { memo, useMemo, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';

import {
  resetPassword as resetPasswordAction,
  flushState as flushStateAction,
} from './actions';

// antd component
import { Form, Input, Button, Alert, Typography } from 'antd';


const ResetPassword = ({
  // core
  state,
  dispatch
}) => {
  const {
    loading, error
  } = state.ResetPassword;

  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const history = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const handleResetPassword = (values) => {
    dispatch(resetPassword({
      ...values,
      email: searchParams.get('email'),
      token: searchParams.get('token'),
    }));
  };

  useEffect(() => {
    if (!searchParams.get('token') && !searchParams.get('email')) {
      navigate('/login');
    }
  }, [searchParams]);

  useEffect(() => {
    i18n.changeLanguage('en');

    const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
    if (currentUser) {
      navigate('/newsfeed');
    }

    return () => {
      dispatch(flushState());
    };
  }, []);

  // render function
  return (
    <div className="resetPassword">
      <div className="auth-container">
        <div className="resetPassword--header">
          <Typography.Title level={1}>
            {t('auth.resetYourPassword')}
          </Typography.Title>
        </div>
        <Form
          name="resetPasswordForm"
          className="resetPassword--form"
          onFinish={handleResetPassword}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label={t('auth.newPassword')}
            rules={[
              { required: true, message: t('common.requiredField') },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]).{8,}$/,
                message: `Your password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number & a special character.`,
              },
            ]}
          >
            <Input.Password
              placeholder={t('auth.newPassword')}
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            name="newPasswordConfirm"
            label={t('auth.newPasswordConfirm')}
            rules={[
              { required: true, message: t('common.requiredField') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t('auth.passwordsShouldMatch')),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t('auth.newPasswordConfirm')}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item noStyle>
            <Button
              htmlType="submit"
              className="resetPassword--form__submit"
              loading={loading}
            >
              {t('auth.newPasswordConfirm')}
            </Button>
          </Form.Item>

          {error && (
            <Alert
              message={t('common.error')}
              description={error}
              type="error"
              closable
              className="resetPassword--form__error"
            />
          )}
        </Form>

        <div className="resetPassword--extra">
          <Link className="resetPassword--extra__login" to="/login">
            {t('auth.goBackToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default compose(withRedux, memo)(ResetPassword);
