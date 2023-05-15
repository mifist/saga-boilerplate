import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import { notification } from 'antd';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

export function* register(action) {
  try {
    const result = yield requestWrapper(
      'POST',
      'auth/signup',
      action.data,
      null,
    );

    if (result) {
      yield put(ACTIONS.registerSuccess());
    } else {
      yield put(ACTIONS.registerError('Error'));
    }
  } catch (error) {
    if (error.response) {
      const responseBody = yield error.response.json();
      console.log(responseBody);

      yield put(ACTIONS.registerError(responseBody.message));
    }
  }
}

export function* resendVerifyEmail(action) {
  try {
    const result = yield requestWrapper(
      'POST',
      `auth/resend-verify-email`,
      action.data,
      null,
    );
    if (result) {
      notification.success({ message: result.message });
      yield put(ACTIONS.resendVerifyEmailSuccess());
    } else {
      yield put(ACTIONS.resendVerifyEmailError('Error'));
    }
  } catch (error) {
    if (error.response) {
      const responseBody = yield error.response.json();
      yield put(ACTIONS.resendVerifyEmailError(responseBody.message));
    }
  }
}

export function* getDictionaries(action) {
  try {
    const data = yield requestWrapper(
      'GET',
      `dictionary/${action.dictionaryType}`,
      '',
      null,
    );

    yield put(ACTIONS.getDictionariesSuccess(data, action.dictionaryType));
  } catch (error) {
    yield put(ACTIONS.getDictionariesError(error));
  }
}

// Individual exports for testing
export default function* registerSaga() {
  yield takeLatest(CONSTANS.REGISTER, register);
  yield takeLatest(CONSTANS.RESEND_VERIFY_EMAIL, resendVerifyEmail);
  yield takeEvery(CONSTANS.GET_DICTIONARIES, getDictionaries);
}
