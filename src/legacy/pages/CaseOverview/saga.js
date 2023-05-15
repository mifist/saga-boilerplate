import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

// Load and Filter cases
export function* loadCases(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { filter } = action;

    const response = yield requestWrapper(
      'POST',
      'posts/filter',
      filter,
      currentUser?.token,
    );

    if (!response && response.length === 0) {
      yield put(ACTIONS.loadCasesSuccess(false));
    } else {
      yield put(ACTIONS.loadCasesSuccess(response));
    }
  } catch (err) {
    yield put(ACTIONS.loadCasesError(true));
  }
}

// CREATE CASE
export function* createCase(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const response = yield requestWrapper(
      'POST',
      'posts/new',
      action.data,
      currentUser.token,
    );

    if (!response) {
      yield put(ACTIONS.createCaseSuccess(false));
    } else {
      yield put(ACTIONS.createCaseSuccess(response[0]));
    }
  } catch (err) {
    yield put(ACTIONS.createCaseError(true));
  }
}

// Update for Single Case
export function* updateLike(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const updatedCase = yield requestWrapper(
      'PATCH',
      'posts',
      {
        _id: action.publication._id,
        likes: action.publication.likes.map(like => ({ _id: like._id })),
      },
      currentUser.token,
    );

    if (!updatedCase) {
      yield put(ACTIONS.createCaseSuccess(false));
    } else {
      yield put(ACTIONS.createCaseSuccess(updatedCase));
    }
  } catch (err) {
    yield put(ACTIONS.createCaseError(true));
  }
}

export default function* caseOverviewSaga() {
  yield takeLatest(CONSTANS.LOAD_CASES, loadCases);
  yield takeLatest(CONSTANS.CREATE_CASE, createCase);
  yield takeLatest(CONSTANS.UPDATE_LIKES, updateLike);
}
