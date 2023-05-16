import React, { memo, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import './style.scss';

// antd component
import { Alert, Spin, Typography } from 'antd';

// utils
import { getBaseApiUrl } from 'utils/capacitorHelper';

export function VerifyEmail() {
  const { t, i18n } = useTranslation();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  axios.defaults.baseURL = getBaseApiUrl();

  useEffect(() => {
    if (searchParams.get('token') && searchParams.get('email')) {
      setLoading(true);
      axios
        .get('/auth/verify-email', {
          params: {
            email: searchParams.get('email'),
            token: searchParams.get('token'),
          },
        })
        .then(({ data }) => {
          console.log(data);
        })
        .catch(reason => {
          setError(reason.response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [searchParams]);

  useEffect(() => {
    i18n.changeLanguage('en');

    const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
    if (currentUser) {
      navigate('/newsfeed');
    }
  }, []);

  // render function
  return (
    <div className="custom-header">
      <div className="verify-email-page">
        <div className="auth-container">
          {loading ? (
            <Spin className="loading-preview" size="large" />
          ) : error?.errorType === 'verifiedEmail' || !error ? (
            <div className="verify-email">
              <Typography.Title level={3} className="verify-email--title">
                {t('auth.emailVerified')}
              </Typography.Title>
              <Typography.Paragraph className="verify-email--description">
                {t('auth.emailVerifiedDesc')}
              </Typography.Paragraph>
              <Link className="verify-email--loginBtn" to="/login">
                {t('common.login')}
              </Link>
            </div>
          ) : (
            <>
              <div className="verify-email">
                <Typography.Title level={3} className="verify-email--title">
                  {t('auth.emailNotVerified')}
                </Typography.Title>
                <Typography.Paragraph className="verify-email--description">
                  {t('auth.emailNotVerifiedDesc')}
                </Typography.Paragraph>
                <Alert
                  description={error?.message}
                  message={t('common.error')}
                  type="error"
                  closable
                  className="verify-email--alert"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

VerifyEmail.propTypes = {};

export default memo(VerifyEmail);
