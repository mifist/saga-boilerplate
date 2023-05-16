import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import i18n from 'i18next';
import moment from 'moment';
import { push } from 'redux-first-history';
import { Capacitor } from '@capacitor/core';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* login(action) {
  try {
    const response = yield requestWrapper(
      'POST',
      'auth/login',
      action.data,
      '',
    );

    if (response.user?._id) {
      localStorage.setItem(
        'beemed_user',
        JSON.stringify({
          _id: response.user._id,
          token: response.user.token,
          role: response.user.role,
          userId: response.user.userId,
        }),
      );

      moment.locale(response.user.language);
      i18n.changeLanguage(response.user.language);
      localStorage.setItem('cometchat:locale', response.user.language);

      yield put(ACTIONS.loginSuccess(response.user));
      yield put(push('/'));
    } else {
      console.warn('token expire', response);
      yield put(ACTIONS.loginError(response));
    }
  } catch (error) {
    if (error.response) {
      const responseBody = yield error.response.json();
      // console.log(responseBody);
      yield put(ACTIONS.loginError(responseBody));
    }
  }
}

export default function* loginSaga() {
  yield takeLatest(CONSTANTS.LOGIN, login);
}
