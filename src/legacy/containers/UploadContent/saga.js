import { call, put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* uploadContentFileSaga(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    // const propertyData = yield select(makeSelectProperty());
    let result = false;

    if (action.fileType !== 'video') {
      result = yield requestWrapper(
        'POST-FORM-DATA',
        'posts/upload/',
        action.file,
        currentUser.token,
      );
    } else {
      result = yield requestWrapper(
        'POST-FORM-DATA',
        'posts/upload-video/',
        action.file,
        currentUser.token,
      );
    }

    if (result) {
      yield put(ACTIONS.uploadContentFileSuccess(result, action.fileType));
    }
  } catch (err) {
    yield put(ACTIONS.uploadContentFileError(true));
  }
}

// Individual exports for testing
export default function* uploadContentSaga() {
  // See example in legacy/containers/HomePage/saga.js
  yield takeLatest(CONSTANTS.UPLOAD_CONTENT_FILE, uploadContentFileSaga);
}
