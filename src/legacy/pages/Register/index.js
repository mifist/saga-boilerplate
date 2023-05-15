import React, { memo, useEffect, useState, useMemo, useRef } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';

import {
  flushState as flushStateAction,
  getDictionaries as getDictionariesAction,
  register as registerAction,
  resendVerifyEmail as resendVerifyEmailAction,
} from './actions';

// antd component
import { Form, Input, Typography, Select, Checkbox, Button, Alert } from 'antd';
// components
import CustomIcons from 'components/CustomIcons';
import QrcodePopup from 'components/QrcodePopup';
// utils
import { professions } from 'utils/categoryHelper';


function Register({
  countries,
  anatomies,
  domains,
  // core
  state,
  dispatch
}) {
  const { 
    loading, error, registerSuccess,
    countries, anatomies, domains,
  } = state.Register;

  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [email, setEmail] = useState(null);
  const [isResendEmail, setIsResendEmail] = useState(false);
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const professionRef = useRef(null);
  const countryRef = useRef(null);

  const handleProfessionSelect = () => {
    if (professionRef.current) {
      professionRef.current.blur();
    }
  };

  const handleCountrySelect = () => {
    if (countryRef.current) {
      countryRef.current.blur();
    }
  };

  useEffect(() => {
    dispatch(getDictionaries('countries'));
    dispatch(getDictionaries('domains'));
    dispatch(getDictionaries('anatomies'));
  }, []);

  useEffect(() => {
    i18n.changeLanguage('en');

    const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
    if (currentUser) {
      let qrcode = searchParams.get('qrcode');
      if (qrcode) {
        history.push(`/newsfeed?qrcode=${qrcode}`);
      } else {
        history.push('/newsfeed');
      }
    }

    const isResend = searchParams.get('isResend');
    const emailResend = searchParams.get('emailResend');

    if (isResend && emailResend) {
      setEmail(emailResend);
      setIsResendEmail(true);
    }

    return () => {
      dispatch(flushState());
    };
  }, []);

  const handleRegister = ({
    hereby,
    termsAndConditions,
    privacyNotice,
    ...rest
  }) => {
    if (hereby && termsAndConditions && privacyNotice) {
      setEmail(rest.email);
      dispatch(register({ ...rest, qrcode: searchParams.get('qrcode') || undefined }));
    }
  };

  const handleResendVerifyEmailBtnClick = () => {
    if (email) {
      dispatch(resendVerifyEmail(email));
    }
  };

  // render function
  return (
    <div className="custom-header">
      <QrcodePopup qrcode={searchParams.get('qrcode')} />
      <div className="registration">
        <div className="auth-container">
          {registerSuccess || isResendEmail ? (
            <div className="registration--emailVerify">
              <CustomIcons type="email" />
              <Typography.Title
                level={3}
                className="registration--emailVerify__title"
              >
                {t('auth.confirmYourEmail')}
              </Typography.Title>
              <Typography.Paragraph className="registration--emailVerify__description">
                {t('auth.confirmEmailDesc')}
              </Typography.Paragraph>
              <Typography.Paragraph className="registration--emailVerify__ifError">
                {t('auth.ifErrorInConfirm')}
              </Typography.Paragraph>
              <Button
                className="registration--emailVerify__resendBtn"
                onClick={handleResendVerifyEmailBtnClick}
                htmlType="button"
                loading={loading}
              >
                {t('auth.resentEmail')}
              </Button>
              {error && (
                <Alert
                  description={error}
                  type="error"
                  closable
                  className="registration--emailVerify__error"
                />
              )}
              <Link className="registration--emailVerify__login" to="/login">
                {t('auth.goBackToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <Typography.Title
                level={3}
                className="registration--header-title"
              >
                {t('auth.signUpForFree')}
              </Typography.Title>

              <Form
                name="register"
                autoComplete="off"
                layout="vertical"
                className="registration--form"
                onFinish={handleRegister}
              >
                <Form.Item
                  name="firstname"
                  label={t('auth.firstName')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    {
                      min: 2,
                      message: t('common.minimumLength', { length: 2 }),
                    },
                    {
                      max: 30,
                      message: t('common.maximumLength', { length: 30 }),
                    },
                  ]}
                >
                  <Input placeholder={t('auth.firstName')} />
                </Form.Item>
                <Form.Item
                  name="lastname"
                  label={t('auth.lastName')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    {
                      min: 2,
                      message: t('common.minimumLength', { length: 2 }),
                    },
                    {
                      max: 30,
                      message: t('common.maximumLength', { length: 30 }),
                    },
                  ]}
                >
                  <Input placeholder={t('auth.lastName')} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={t('auth.emailAddress')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    { type: 'email', message: t('common.validEmail') },
                  ]}
                >
                  <Input
                    placeholder={t('auth.emailAddress')}
                    type="email"
                    onInput={(e) =>
                      (e.target.value = e.target.value.toLowerCase())
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={t('auth.password')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    // {
                    //   min: 8,
                    //   message: t('common.minimumLength', { length: 8 }),
                    // },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]).{8,}$/,
                      message: `Your password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number & a special character.`,
                    },
                  ]}
                >
                  <Input.Password
                    placeholder={t('auth.password')}
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
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
                    placeholder={t('auth.confirmPassword')}
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item
                  name="country"
                  label={t('auth.selectCountry')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                  ]}
                >
                  <Select
                    placeholder={t('auth.country')}
                    showSearch
                    optionFilterProp="children"
                    getPopupContainer={(trigger) => trigger.parentElement}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    ref={countryRef}
                    onSelect={handleCountrySelect}
                  >
                    {countries?.map((country) => (
                      <Select.Option
                        value={country?.id.toString()}
                        key={country?.id}
                      >
                        {country?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="domains"
                  label={t('auth.defineDomainsAndAnatomies')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                  ]}
                >
                  <Select
                    placeholder={t('common.domains')}
                    showSearch
                    allowClear
                    mode="multiple"
                    optionFilterProp="children"
                    getPopupContainer={(trigger) => trigger.parentElement}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {domains?.map((domain) => (
                      <Select.Option
                        value={domain.id.toString()}
                        key={domain.id}
                      >
                        {domain.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="anatomies"
                  rules={[
                    { required: true, message: t('common.requiredField') },
                  ]}
                >
                  <Select
                    placeholder={t('common.anatomies')}
                    showSearch
                    allowClear
                    mode="multiple"
                    optionFilterProp="children"
                    getPopupContainer={(trigger) => trigger.parentElement}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {anatomies?.map((anatomy) => (
                      <Select.Option
                        value={anatomy.id.toString()}
                        key={anatomy.id}
                      >
                        {anatomy.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="profession"
                  rules={[
                    { required: true, message: t('common.requiredField') },
                  ]}
                >
                  <Select
                    placeholder={t('common.profession')}
                    showSearch
                    optionFilterProp="children"
                    getPopupContainer={(trigger) => trigger.parentElement}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    ref={professionRef}
                    onSelect={handleProfessionSelect}
                  >
                    {professions?.map((profession) => (
                      <Select.Option
                        value={profession.value.toString()}
                        key={profession.id}
                      >
                        {t(`common.professions-${profession.label}`)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="hereby"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t('auth.confirmationHerebyError')),
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    <p>{t('auth.herebyThatIAmEither')}</p>
                    <ul>
                      <li>{t('auth.physician')}</li>
                      <li>{t('auth.physiotherapist')}</li>
                      <li>{t('auth.nurse')}</li>
                      <li>{t('auth.student')}</li>
                      <li>{t('auth.worker')}</li>
                    </ul>
                  </Checkbox>
                </Form.Item>
                <Typography.Paragraph className="registration--form__legalNoticeDescription">
                  {t('auth.legalNoticeDescription')}
                </Typography.Paragraph>
                <Form.Item
                  name="termsAndConditions"
                  valuePropName="checked"
                  className="registration--form__conditions"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t('auth.confirmationHerebyError')),
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    <p>
                      {t('auth.iAggree')}
                      <a href="https://beemed.com/static/legal" target="_blank">
                        {t('auth.termsAndConditions')}
                      </a>
                    </p>
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="privacyNotice"
                  valuePropName="checked"
                  className="registration--form__conditions"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t('auth.confirmationHerebyError')),
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    <p>
                      {t('auth.iConsent')}
                      <a
                        href="https://beemed.com/static/cookies"
                        target="_blank"
                      >
                        {t('auth.thePrivacyNotice')}
                      </a>
                    </p>
                  </Checkbox>
                </Form.Item>

                <Form.Item noStyle>
                  <Button
                    htmlType="submit"
                    className="registration--form__signUpBtn"
                    loading={loading}
                  >
                    {t('common.signUp')}
                  </Button>
                </Form.Item>

                {error && (
                  <Alert
                    description={
                      Object.keys(error).length > 0 && error.email
                        ? error.email[0]
                        : error
                    }
                    type="error"
                    closable
                    className="registration--form__error"
                  />
                )}

                <div className="registration--form__extra">
                  <p className="registration--form__extra--text">
                    <span>{t('auth.alreadyAMember')}</span>
                  </p>
                  <Link
                    className="registration--form__extra--loginBtn"
                    to={`/login?${searchParams.toString()}`}
                  >
                    {t('common.login')}
                  </Link>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Register.propTypes = {
  loading: PropTypes.bool,
};

export default compose(withRedux, memo)(Register);
