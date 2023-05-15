import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import {
  UPDATE_CASE,
  LOAD_CASE,
  ON_DELETE,
  PIN_UNPIN_POST,
  HIDE_UNHIDE_POST,
  LOAD_COMMUNITY_TAGS,
} from './constants';
import {
  updateCaseError,
  updateCaseSuccess,
  loadCaseError,
  loadCaseSuccess,
  onDeleteSuccess,
  pinUnpinPostSuccess,
  pinUnpinPostError,
  hideUnhidePostSuccess,
  hideUnhidePostError,
  loadCommunityTagsSuccess,
  loadCommunityTagsError,
} from './actions';
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
      yield put(loadCaseSuccess(false));
    } else {
      yield put(loadCaseSuccess(caseData));
    }
  } catch (error) {
    console.log(error);
    yield put(loadCaseError(error));
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
      yield put(onDeleteSuccess());
    }
  } catch (error) {
    yield put(loadCaseError(error));
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
      yield put(updateCaseSuccess(false));
    } else {
      yield put(updateCaseSuccess(response));
    }
  } catch (error) {
    yield put(updateCaseError(error));
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
      yield put(pinUnpinPostSuccess(pinned));
    } else {
      notification.error({ message: 'Something went wrong' });
      yield put(pinUnpinPostError(result));
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
      yield put(hideUnhidePostError(false));
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong' });
    yield put(hideUnhidePostError(error));
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
        yield put(loadCommunityTagsSuccess(false));
      } else {
        yield put(loadCommunityTagsSuccess(result));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(loadCommunityTagsError(error));
  }
}

// Individual exports for testing
export default function* caseDetailSaga() {
  yield takeLatest(LOAD_CASE, loadCase);
  yield takeLatest(UPDATE_CASE, updateCase);
  yield takeLatest(ON_DELETE, onDelete);
  yield takeLatest(PIN_UNPIN_POST, pinUnpinPost);
  yield takeLatest(HIDE_UNHIDE_POST, hideUnhidePost);
  yield takeLatest(LOAD_COMMUNITY_TAGS, loadCommunityTags);
}
