import { put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

// Load and Filter Podcasts
export function* loadPodcasts(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { filter } = action;
    const podcasts = yield requestWrapper(
      'POST',
      'posts/filter',
      filter,
      currentUser?.token,
    );

    if (!podcasts && podcasts.length === 0) {
      yield put(ACTIONS.loadPodcastsSuccess(false));
    } else {
      yield put(ACTIONS.loadPodcastsSuccess(podcasts));
    }
  } catch (err) {
    yield put(ACTIONS.loadPodcastsError(true));
  }
}

export function* handleCreatePodcast(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const data = action.data;

    const result = yield requestWrapper(
      'POST',
      'posts/new',
      data,
      currentUser.token,
    );

    if (!result) {
      yield put(ACTIONS.createPodcastSuccess(false));
    } else {
      yield put(ACTIONS.createPodcastSuccess(result[0]));
    }
  } catch (err) {
    yield put(ACTIONS.createPodcastError(true));
  }
}
// Individual exports for testing
export default function* podcastsOverviewSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CONSTANS.LOAD_PODCASTS, loadPodcasts);
  yield takeLatest(CONSTANS.CREATE_PODCAST, handleCreatePodcast);
}
