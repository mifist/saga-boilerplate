import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// REGISTER
export function forgotPassword(data) {
  return {
    type: CONSTANTS.FORGOT_PASSWORD,
    data,
  };
}

export function forgotPasswordSuccess() {
  return {
    type: CONSTANTS.FORGOT_PASSWORD_SUCCESS,
  };
}

export function forgotPasswordError(error) {
  return {
    type: CONSTANTS.FORGOT_PASSWORD_ERROR,
    error,
  };
}
