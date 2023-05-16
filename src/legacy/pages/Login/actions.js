import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function login(data) {
  return {
    type: CONSTANTS.LOGIN,
    data,
  };
}

export function loginSuccess(user) {
  return {
    type: CONSTANTS.LOGIN_SUCCESS,
    user,
  };
}

export function loginError(error) {
  return {
    type: CONSTANTS.LOGIN_ERROR,
    error,
  };
}
