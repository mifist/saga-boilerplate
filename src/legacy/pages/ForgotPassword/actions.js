import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

// REGISTER
export function forgotPassword(data) {
  return {
    type: CONSTANS.FORGOT_PASSWORD,
    data,
  };
}

export function forgotPasswordSuccess() {
  return {
    type: CONSTANS.FORGOT_PASSWORD_SUCCESS,
  };
}

export function forgotPasswordError(error) {
  return {
    type: CONSTANS.FORGOT_PASSWORD_ERROR,
    error,
  };
}
