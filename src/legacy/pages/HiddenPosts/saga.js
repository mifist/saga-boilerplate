import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* loadHiddenPosts() {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    // we get the campaigns linked to the user
    const hiddenPosts = yield requestWrapper(
      'GET',
      'posts/hidden-posts',
      null,
      currentUser?.token,
    );

    yield put(ACTIONS.loadHiddenPostsSuccess(hiddenPosts?.data));
  } catch (err) {
    yield put(ACTIONS.loadHiddenPostsError(err));
  }
}

export function* unhidePost(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { postId } = action;

    const result = yield requestWrapper(
      'POST',
      'posts/hide',
      { _id: postId, hidden: false },
      currentUser.token,
    );

    if (result) {
      yield put(ACTIONS.unhidePostSuccess(postId));
    } else {
      yield put(ACTIONS.unhidePostError(result));
    }
  } catch (error) {
    yield put(ACTIONS.unhidePostError(error));
  }
}

// Individual exports for testing
export default function* hiddenPostsSaga() {
  yield takeLatest(CONSTANTS.LOAD_HIDDEN_POSTS, loadHiddenPosts);
  yield takeLatest(CONSTANTS.UNHIDE_POST, unhidePost);
}
