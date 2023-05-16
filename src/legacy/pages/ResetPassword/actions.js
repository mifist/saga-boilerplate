import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// REGISTER
export function resetPassword(data) {
  return {
    type: CONSTANTS.RESET_PASSWORD,
    data,
  };
}

export function resetPasswordSuccess() {
  return {
    type: CONSTANTS.RESET_PASSWORD_SUCCESS,
  };
}

export function resetPasswordError(error) {
  return {
    type: CONSTANTS.RESET_PASSWORD_ERROR,
    error,
  };
}
