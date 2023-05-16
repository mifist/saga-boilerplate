import { put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

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
      yield put(ACTIONS.loadArticleSuccess(false));
    } else {
      yield put(ACTIONS.loadArticleSuccess(article));
    }
  } catch (error) {
    yield put(ACTIONS.loadArticleError(error));
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
      yield put(ACTIONS.updateArticleSuccess(false));
    } else {
      yield put(ACTIONS.updateArticleSuccess(response));
    }
  } catch (error) {
    yield put(ACTIONS.updateArticleError(error));
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
      yield put(ACTIONS.pinUnpinPostError(false));
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
export default function* articleDetailSaga() {
  yield takeLatest(CONSTANTS.LOAD_ARTICLE, loadArticle);
  yield takeLatest(CONSTANTS.UPDATE_ARTICLE, updateArticle);
  yield takeLatest(CONSTANTS.ON_DELETE, onDelete);
  yield takeLatest(CONSTANTS.PIN_UNPIN_POST, pinUnpinPost);
  yield takeLatest(CONSTANTS.HIDE_UNHIDE_POST, hideUnhidePost);
}
