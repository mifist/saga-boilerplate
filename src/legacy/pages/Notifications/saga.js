import { put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import { push } from 'redux-first-history';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* loadNotifications(action) {
  try {
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const notifications = yield requestWrapper(
      'GET',
      `notifications/user/${action.userId}/10/${action.page}`,
      null,
      currentUser.token,
    );

    if (notifications.data.length !== 0) {
      yield put(
        ACTIONS.loadNotificationsSuccess(
          notifications.data,
          notifications.totalCount,
        ),
      );
    } else {
      yield put(ACTIONS.loadNotificationsError(true));
    }
  } catch (err) {
    yield put(ACTIONS.loadNotificationsError(false));
  }
}

export function* updateNotification(action) {
  try {
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { notification } = action;

    const _id = notification.post?._id;
    const type = notification.post?.type;

    if (_id === null) {
      switch (type) {
        case 'article':
        case 'articles':
          yield put(push(`/article`));
          break;
        case 'post':
        case 'posts':
          yield put(push(``));
          break;
        case 'case':
        case 'cases':
          yield put(push(`/case`));
          break;
        case 'event':
        case 'events':
          yield put(push(`/event`));
          break;
        case 'podcast':
        case 'podcasts':
          yield put(push(`/podcast`));
          break;
      }
    } else {
      switch (type) {
        case 'profile':
          yield put(push(`/profile/${_id}`));
          break;
        case 'article':
          yield put(push(`/article/detail/${_id}`));
          break;
        case 'post':
        case 'case':
          yield put(push(`/case/detail/${_id}`));
          break;
        case 'event':
          yield put(push(`/event/detail/${_id}`));
          break;
        case 'podcast':
          yield put(push(`/podcast/detail/${_id}`));
          break;
      }
    }

    let updatedNotification;

    if (notification) {
      updatedNotification = yield requestWrapper(
        'PATCH',
        `notifications`,
        notification,
        currentUser.token,
      );
    }

    if (!updatedNotification) {
      yield put(ACTIONS.updateNotificationSuccess(false));
    } else {
      yield put(ACTIONS.updateNotificationSuccess(updatedNotification));
    }
  } catch (error) {
    yield put(ACTIONS.updateNotificationError(error));
  }
}

// Individual exports for testing
export default function* notificationsSaga() {
  yield takeLatest(CONSTANTS.LOAD_NOTIFICATIONS, loadNotifications);
  yield takeLatest(CONSTANTS.UPDATE_NOTIFICATION, updateNotification);
}
