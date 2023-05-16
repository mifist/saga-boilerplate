import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import { push } from 'redux-first-history';

import { notification } from 'antd';
import i18next from 'i18next';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* resetPassword(action) {
  try {
    const result = yield requestWrapper(
      'POST',
      'auth/reset-password',
      action.data,
      null,
    );

    if (result) {
      yield put(ACTIONS.resetPasswordSuccess());
      notification.success({ message: i18next.t('auth.resetetPassword') });
      yield put(push('/login'));
    } else {
      yield put(ACTIONS.resetPasswordError('Error'));
    }
  } catch (error) {
    if (error.response) {
      const responseBody = yield error.response.json();
      yield put(ACTIONS.resetPasswordError(responseBody.message));
    }
  }
}

// Individual exports for testing
export default function* resetPasswordSaga() {
  yield takeLatest(CONSTANTS.RESET_PASSWORD, resetPassword);
}
