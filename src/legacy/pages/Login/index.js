import React, { memo, useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import {
  login as loginAction,
  flushState as flushStateAction,
} from './actions';

// assets
import logoLogin from 'images/logo-name.svg';

// antd component
import { Form, Input, Button, Alert } from 'antd';
// components
import QrcodePopup from 'legacy/components/QrcodePopup';

// contexts
import { withUser } from 'appContext/User.context';
// utils
import api, { setAuthorizationHeader } from 'appAPI/axiosAPI';

const Login = ({
  // props
  user,
  // default props
  className,
  // core
  state,
  dispatch,
}) => {
  const { loading, error, userAuth } = state.Login;

  const history = useHistory();
  const { t, i18n } = useTranslation();
  const { search } = useLocation();

  const [email, setEmail] = useState(false);
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const handleLogin = (values) => {
    setEmail(values.email);
    dispatch(
      login({ ...values, qrcode: searchParams.get('qrcode') || undefined }),
    );
  };

  // redirect after login with ecourse or event on url
  useEffect(() => {
    if (!loading && userAuth) {
      user.populateUser(userAuth);
      const ecourse = searchParams.get('ecourse_id');
      const event = searchParams.get('event_id');

      if (ecourse) {
        setAuthorizationHeader(userAuth.token);
        api.users
          .getEcoursesLinkById({
            ecourseId: ecourse,
            userId: userAuth.userId,
          })
          .then(({ data }) => {
            window.location.href = data.result;
            return;
          });
      }
      if (event) {
        setAuthorizationHeader(userAuth.token);
        api.events.getEventById(event).then(({ data }) => {
          if (data.min_price === 'Free') {
            history.push(`/event/detail/${event}`);
          } else {
            api.users
              .getEventLinkById({
                eventId: event,
                userId: userAuth.userId,
              })
              .then(({ data }) => {
                window.location.href = data.result;
                return;
              });
          }
        });
      }
    }
  }, [userAuth]);

  // redirect when access to login and the user is already logged in
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('beemed_user'));

    if (currentUser) {
      const ecourse = searchParams.get('ecourse_id');
      const event = searchParams.get('event_id');
      const qrcode = searchParams.get('qrcode');

      if (ecourse) {
        api.users
          .getEcoursesLinkById({
            ecourseId: ecourse,
            userId: currentUser?.userId,
          })
          .then(({ data }) => {
            window.location.href = data.result;
            return;
          });
      }

      if (event) {
        api.events.getEventById(event).then(({ data }) => {
          if (data.min_price === 'Free') {
            history.push(`/event/detail/${event}`);
          } else {
            api.users
              .getEventLinkById({
                eventId: event,
                userId: currentUser?.userId,
              })
              .then(({ data }) => {
                window.location.href = data.result;
                return;
              });
          }
        });
      }

      if (qrcode) {
        history.push(`/newsfeed?qrcode=${qrcode}`);
        return;
      }

      history.push('/newsfeed');
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage('en');

    return () => {
      dispatch(flushState());
    };
  }, []);

  // render function
  return (
    <div className="custom-header">
      <QrcodePopup qrcode={searchParams.get('qrcode')} />
      <div className="login">
        <div className="auth-container">
          <div className="login--header">
            <img src={logoLogin} className="logo-login" alt="BeeMed Logo" />
          </div>
          <Form
            name="loginForm"
            className="login--form"
            onFinish={handleLogin}
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
                onInput={(e) => (e.target.value = e.target.value.toLowerCase())}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('auth.password')}
              rules={[
                { required: true, message: t('common.requiredField') },
                {
                  min: 3,
                  message: t('common.minimumLength', { length: 3 }),
                },
              ]}
            >
              <Input.Password placeholder={t('login.password')} />
            </Form.Item>

            <Form.Item noStyle>
              <Button
                htmlType="submit"
                className="login--form__submit"
                loading={loading}
              >
                {t('common.login')}
              </Button>
            </Form.Item>

            {error && (
              <Alert
                message={t('login.connectionError')}
                // description={t('login.authError')}
                description={
                  error?.errors?.type !== 'not verified' ? (
                    t('login.authError')
                  ) : (
                    <div>
                      Your e-mail has not yet been validated, please check your
                      mails and spam folders for the verification e-mail, or use
                      the link below to resend a verification e-mail. <br />
                      <br />
                      <b>
                        <Link
                          to={`register?isResend=true&emailResend=${email}`}
                        >
                          {' '}
                          Resend verification e-mail
                        </Link>
                      </b>
                    </div>
                  )
                }
                className="login--form__error"
                type="error"
                closable
              />
            )}
          </Form>

          <div className="login--extra">
            <Link
              className="login--extra__forgot-password"
              to="/forgot-password"
            >
              {t('auth.forgotYourPassword')}
            </Link>
            <p className="login--extra__text">
              <span>{t('auth.notAMember')}</span>
            </p>
            <Link
              className="login--extra__registerBtn"
              to={`/register?${searchParams.toString()}`}
            >
              {t('auth.createAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(withRedux, withUser, memo)(Login);
