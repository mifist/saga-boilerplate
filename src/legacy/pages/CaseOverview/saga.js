import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import { LOAD_CASES, CREATE_CASE, UPDATE_LIKES } from './constants';

import {
  loadCasesError,
  loadCasesSuccess,
  createCaseError,
  createCaseSuccess,
} from './actions';

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
      yield put(loadCasesSuccess(false));
    } else {
      yield put(loadCasesSuccess(response));
    }
  } catch (err) {
    yield put(loadCasesError(true));
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
      yield put(createCaseSuccess(false));
    } else {
      yield put(createCaseSuccess(response[0]));
    }
  } catch (err) {
    yield put(createCaseError(true));
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
      yield put(createCaseSuccess(false));
    } else {
      yield put(createCaseSuccess(updatedCase));
    }
  } catch (err) {
    yield put(createCaseError(true));
  }
}

export default function* caseOverviewSaga() {
  yield takeLatest(LOAD_CASES, loadCases);
  yield takeLatest(CREATE_CASE, createCase);
  yield takeLatest(UPDATE_LIKES, updateLike);
}
