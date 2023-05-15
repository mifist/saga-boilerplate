import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import requestWrapper from 'utils/requestWrapper';
import { Capacitor } from '@capacitor/core';
import i18n from 'i18next';
import moment from 'moment';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

export function* loadUser(action) {
  try {
    // we retrieve the token from the local storage
    // const token = localStorage.getItem('token');
    // we get the campaigns linked to the user

    let isProduction = 'development';
    if (process.env.NODE_ENV === 'production') {
      if (window.location.origin.includes('app.beemed.com')) {
        isProduction = 'production';
      } else {
        isProduction = 'staging';
      }
    }

    if (Capacitor.platform !== 'web') {
      isProduction = 'mobile';
    }

    const user = yield requestWrapper(
      'POST',
      `auth/beemed`,
      {
        code: action.code,
        env: isProduction,
      },
      '',
    );
    // console.debug(user);
    // console.debug('GET THE USER SUCCESS');
    if (user?._id) {
      localStorage.setItem(
        'beemed_user',
        JSON.stringify({
          access_token: user.access_token,
          _id: user._id,
          token: user.token,
          role: user.role,
        }),
      );

      moment.locale(user.language);
      i18n.changeLanguage(user.language);
      localStorage.setItem('cometchat:locale', user.language);

      yield put(ACTIONS.loadUserSuccess(user));
    } else {
      console.warn('token expire', user);
      yield put(ACTIONS.loadUserError(user));
    }
  } catch (err) {
    yield put(ACTIONS.loadUserError(err));
  }
}

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
      yield put(ACTIONS.push('/'));
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
  yield takeLatest(CONSTANS.LOGIN, login);
}
