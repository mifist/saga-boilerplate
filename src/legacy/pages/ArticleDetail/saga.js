import { put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import {
  UPDATE_ARTICLE,
  LOAD_ARTICLE,
  ON_DELETE,
  PIN_UNPIN_POST,
  HIDE_UNHIDE_POST,
} from './constants';

import {
  updateArticleError,
  updateArticleSuccess,
  loadArticleError,
  loadArticleSuccess,
  onDeleteSuccess,
  pinUnpinPostSuccess,
  pinUnpinPostError,
  hideUnhidePostSuccess,
  hideUnhidePostError,
} from './actions';

import { notification } from 'antd';

export function* loadArticle(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const article = yield requestWrapper(
      'GET',
      `posts/next/article/${action.id}`,
      '',
      currentUser?.token,
    );

    if (!article && Object.keys(article.data).length === 0) {
      yield put(loadArticleSuccess(false));
    } else {
      yield put(loadArticleSuccess(article));
    }
  } catch (error) {
    yield put(loadArticleError(error));
  }
}

export function* updateArticle(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const response = yield requestWrapper(
      'PATCH',
      'posts',
      action.data,
      currentUser.token,
    );

    if (!response) {
      yield put(updateArticleSuccess(false));
    } else {
      yield put(updateArticleSuccess(response));
    }
  } catch (error) {
    yield put(updateArticleError(error));
  }
}

export function* onDelete(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const deleteCase = yield requestWrapper(
      'PATCH',
      `posts/delete`,
      { objects: [action.id] },
      currentUser.token,
    );

    if (deleteCase) {
      yield put(onDeleteSuccess());
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
      yield put(pinUnpinPostSuccess(pinned));
    } else {
      notification.error({ message: 'Something went wrong' });
      yield put(pinUnpinPostError(false));
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong' });
    yield put(pinUnpinPostError(error));
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
      yield put(hideUnhidePostSuccess(hidden));
    } else {
      notification.error({ message: 'Something went wrong' });
      yield put(hideUnhidePostError(result));
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong' });
    yield put(hideUnhidePostError(error));
  }
}

// Individual exports for testing
export default function* articleDetailSaga() {
  yield takeLatest(LOAD_ARTICLE, loadArticle);
  yield takeLatest(UPDATE_ARTICLE, updateArticle);
  yield takeLatest(ON_DELETE, onDelete);
  yield takeLatest(PIN_UNPIN_POST, pinUnpinPost);
  yield takeLatest(HIDE_UNHIDE_POST, hideUnhidePost);
}
