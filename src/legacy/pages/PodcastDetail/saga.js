import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

import { notification } from 'antd';

export function* loadPodcast(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const podcast = yield requestWrapper(
      'GET',
      `posts/next/podcast/${action.id}`,
      '',
      currentUser?.token,
    );

    if (podcast.length === 0) {
      yield put(ACTIONS.loadPodcastSuccess(false));
    } else {
      yield put(ACTIONS.loadPodcastSuccess(podcast));
    }
  } catch (error) {
    yield put(ACTIONS.loadPodcastError(error));
  }
}

export function* updatePodcast(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const result = yield requestWrapper(
      'PATCH',
      'posts',
      action.data,
      currentUser.token,
    );

    if (!result) {
      yield put(ACTIONS.updatePodcastSuccess(false));
    } else {
      yield put(ACTIONS.updatePodcastSuccess(result));
    }
  } catch (error) {
    yield put(ACTIONS.updatePodcastError(error));
  }
}

export function* onDelete(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const result = yield requestWrapper(
      'PATCH',
      `posts/delete`,
      { objects: [action.id] },
      currentUser.token,
    );

    if (result) {
      yield put(ACTIONS.onDeleteSuccess());
    }
  } catch (error) {}
}

export function* pinUnpinPost(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { postId, pinned } = action;

    const result = yield requestWrapper(
      'POST',
      'posts/pin',
      { _id: postId, pinned },
      currentUser.token,
    );

    if (result) {
      notification.success({ message: result.message });
      yield put(ACTIONS.pinUnpinPostSuccess(pinned));
    } else {
      notification.error({ message: 'Something went wrong' });
      yield put(ACTIONS.pinUnpinPostError(result));
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong' });
    yield put(ACTIONS.pinUnpinPostError(error));
  }
}

export function* hideUnhidePost(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { postId, hidden } = action;

    const result = yield requestWrapper(
      'POST',
      'posts/hide',
      { _id: postId, hidden },
      currentUser.token,
    );

    if (result) {
      notification.success({ message: result.message });
      yield put(ACTIONS.hideUnhidePostSuccess(hidden));
    } else {
      notification.error({ message: 'Something went wrong' });
      yield put(ACTIONS.hideUnhidePostError(result));
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong' });
    yield put(ACTIONS.hideUnhidePostError(error));
  }
}

// Individual exports for testing
export default function* podcastDetailSaga() {
  yield takeLatest(CONSTANTS.LOAD_PODCAST, loadPodcast);
  yield takeLatest(CONSTANTS.UPDATE_PODCAST, updatePodcast);
  yield takeLatest(CONSTANTS.ON_DELETE, onDelete);
  yield takeLatest(CONSTANTS.PIN_UNPIN_POST, pinUnpinPost);
  yield takeLatest(CONSTANTS.HIDE_UNHIDE_POST, hideUnhidePost);
}
