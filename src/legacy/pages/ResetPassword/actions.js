import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

// REGISTER
export function resetPassword(data) {
  return {
    type: CONSTANS.RESET_PASSWORD,
    data,
  };
}

export function resetPasswordSuccess() {
  return {
    type: CONSTANS.RESET_PASSWORD_SUCCESS,
  };
}

export function resetPasswordError(error) {
  return {
    type: CONSTANS.RESET_PASSWORD_ERROR,
    error,
  };
}
