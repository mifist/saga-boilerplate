import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function login(data) {
  return {
    type: CONSTANS.LOGIN,
    data,
  };
}

export function loginSuccess(user) {
  return {
    type: CONSTANS.LOGIN_SUCCESS,
    user,
  };
}

export function loginError(error) {
  return {
    type: CONSTANS.LOGIN_ERROR,
    error,
  };
}
