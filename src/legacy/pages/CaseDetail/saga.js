import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

import { notification } from 'antd';

export function* loadCase(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    let type = 'case';
    if (window?.location?.pathname.includes('post')) {
      type = 'post';
    }

    const caseData = yield requestWrapper(
      'GET',
      `posts/next/${type}/${action.id}`,
      '',
      currentUser?.token,
    );

    if (caseData.length === 0) {
      yield put(ACTIONS.loadCaseSuccess(false));
    } else {
      yield put(ACTIONS.loadCaseSuccess(caseData));
    }
  } catch (error) {
    //console.log(error);
    yield put(ACTIONS.loadCaseError(error));
  }
}
export function* onDelete(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const response = yield requestWrapper(
      'PATCH',
      'posts/delete',
      { objects: [action.id] },
      currentUser.token,
    );

    if (response) {
      yield put(ACTIONS.onDeleteSuccess());
    }
  } catch (error) {
    yield put(ACTIONS.loadCaseError(error));
  }
}

export function* updateCase(action) {
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
      yield put(ACTIONS.updateCaseSuccess(false));
    } else {
      yield put(ACTIONS.updateCaseSuccess(response));
    }
  } catch (error) {
    yield put(ACTIONS.updateCaseError(error));
  }
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
      yield put(ACTIONS.hideUnhidePostError(false));
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong' });
    yield put(ACTIONS.hideUnhidePostError(error));
  }
}

export function* loadCommunityTags(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    if (currentUser) {
      const result = yield requestWrapper(
        'GET',
        `communities/tags/${action.id}`,
        '',
        currentUser.token,
      );

      if (!result) {
        yield put(ACTIONS.loadCommunityTagsSuccess(false));
      } else {
        yield put(ACTIONS.loadCommunityTagsSuccess(result));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.loadCommunityTagsError(error));
  }
}

// Individual exports for testing
export default function* caseDetailSaga() {
  yield takeLatest(CONSTANTS.LOAD_CASE, loadCase);
  yield takeLatest(CONSTANTS.UPDATE_CASE, updateCase);
  yield takeLatest(CONSTANTS.ON_DELETE, onDelete);
  yield takeLatest(CONSTANTS.PIN_UNPIN_POST, pinUnpinPost);
  yield takeLatest(CONSTANTS.HIDE_UNHIDE_POST, hideUnhidePost);
  yield takeLatest(CONSTANTS.LOAD_COMMUNITY_TAGS, loadCommunityTags);
}
