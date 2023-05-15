import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

// REGISTER
export function register(data) {
  return {
    type: CONSTANS.REGISTER,
    data,
  };
}

export function registerSuccess() {
  return {
    type: CONSTANS.REGISTER_SUCCESS,
  };
}

export function registerError(error) {
  return {
    type: CONSTANS.REGISTER_ERROR,
    error,
  };
}

// RESEND VERIFY EMAIL
export function resendVerifyEmail(email) {
  return {
    type: CONSTANS.RESEND_VERIFY_EMAIL,
    data: {
      email,
    },
  };
}

export function resendVerifyEmailSuccess() {
  return {
    type: CONSTANS.RESEND_VERIFY_EMAIL_SUCCESS,
  };
}

export function resendVerifyEmailError(error) {
  return {
    type: CONSTANS.RESEND_VERIFY_EMAIL_ERROR,
    error,
  };
}

// Countries
export function getDictionaries(dictionaryType) {
  return {
    type: CONSTANS.GET_DICTIONARIES,
    dictionaryType,
  };
}

export function getDictionariesSuccess(data, dictionaryType) {
  return {
    type: CONSTANS.GET_DICTIONARIES_SUCCESS,
    data,
    dictionaryType,
  };
}

export function getDictionariesError(error) {
  return {
    type: CONSTANS.GET_DICTIONARIES_ERROR,
    error,
  };
}
