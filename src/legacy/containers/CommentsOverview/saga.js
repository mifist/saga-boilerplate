import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import { LOAD_COMMENTS, REPORT_POST, MODIFY_POST_TYPE } from './constants';
import {
  loadCommentsError,
  loadCommentsSuccess,
  reportPostError,
  reportPostSuccess,
  modifyPostTypeError,
  modifyPostTypeSuccess,
} from './actions';
import { notification } from 'antd';
import i18n from 'i18next';

import { updateCaseSuccess } from 'pages/CaseDetail/actions';

export function* loadComments(action) {
  try {
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id, commentType } = action;

    const comments = yield requestWrapper(
      'GET',
      `comments/${commentType === 'event' ? 'event' : 'post'}/${id}`,
      '',
      currentUser?.token,
    );

    if (!id && comments.length === 0) {
      yield put(loadCommentsSuccess(false));
    } else {
      yield put(loadCommentsSuccess(comments));
    }
  } catch (error) {
    yield put(loadCommentsError(error));
  }
}

export function* reportPost(action) {
  try {
    const { postId } = action.data;
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const report = yield requestWrapper(
      'POST',
      `posts/${postId}/report`,
      action.data,
      currentUser.token,
    );

    if (!report) {
      notification.error({ message: i18n.t('common.somethingWentWrong') });
      yield put(reportPostSuccess(false));
    } else {
      notification.success({ message: report.data });
      yield put(reportPostSuccess());
    }
  } catch (error) {
    notification.error({ message: i18n.t('common.somethingWentWrong') });
    yield put(reportPostError(error));
  }
}

export function* modifyPostType(action) {
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
      notification.error({ message: i18n.t('common.somethingWentWrong') });
      yield put(modifyPostTypeSuccess(false));
    } else {
      notification.success({ message: 'Successfullt modified post type' });
      yield put(modifyPostTypeSuccess());
      yield put(updateCaseSuccess(response));
    }
  } catch (error) {
    notification.error({ message: i18n.t('common.somethingWentWrong') });
    yield put(modifyPostTypeError(error));
  }
}

// Individual exports for testing
export default function* commentsOverviewSaga() {
  yield takeLatest(LOAD_COMMENTS, loadComments);
  yield takeLatest(REPORT_POST, reportPost);
  yield takeLatest(MODIFY_POST_TYPE, modifyPostType);
}
