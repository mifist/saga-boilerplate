import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* forgotPassword(action) {
  try {
    const result = yield requestWrapper(
      'POST',
      'auth/forgot-password',
      action.data,
      null,
    );

    if (result) {
      yield put(ACTIONS.forgotPasswordSuccess());
    } else {
      yield put(ACTIONS.forgotPasswordError('Error'));
    }
  } catch (error) {
    if (error.response) {
      const responseBody = yield error.response.json();
      yield put(ACTIONS.forgotPasswordError(responseBody.message));
    }
  }
}

// Individual exports for testing
export default function* forgotPasswordSaga() {
  yield takeLatest(CONSTANTS.FORGOT_PASSWORD, forgotPassword);
}
