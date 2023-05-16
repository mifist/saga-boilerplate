import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// REGISTER
export function register(data) {
  return {
    type: CONSTANTS.REGISTER,
    data,
  };
}

export function registerSuccess() {
  return {
    type: CONSTANTS.REGISTER_SUCCESS,
  };
}

export function registerError(error) {
  return {
    type: CONSTANTS.REGISTER_ERROR,
    error,
  };
}

// RESEND VERIFY EMAIL
export function resendVerifyEmail(email) {
  return {
    type: CONSTANTS.RESEND_VERIFY_EMAIL,
    data: {
      email,
    },
  };
}

export function resendVerifyEmailSuccess() {
  return {
    type: CONSTANTS.RESEND_VERIFY_EMAIL_SUCCESS,
  };
}

export function resendVerifyEmailError(error) {
  return {
    type: CONSTANTS.RESEND_VERIFY_EMAIL_ERROR,
    error,
  };
}

// Countries
export function getDictionaries(dictionaryType) {
  return {
    type: CONSTANTS.GET_DICTIONARIES,
    dictionaryType,
  };
}

export function getDictionariesSuccess(data, dictionaryType) {
  return {
    type: CONSTANTS.GET_DICTIONARIES_SUCCESS,
    data,
    dictionaryType,
  };
}

export function getDictionariesError(error) {
  return {
    type: CONSTANTS.GET_DICTIONARIES_ERROR,
    error,
  };
}
