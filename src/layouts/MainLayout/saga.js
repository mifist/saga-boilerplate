import { put, takeLatest } from 'redux-saga/effects';

import requestWrapper from 'utils/requestWrapper';
import {
  LOAD_FRESH_NOTIFICATIONS,
  RESET_NOTIFICATIONS,
} from '../../legacy/pages/Notifications/constants';

import {
  loadFreshNotificationsError,
  loadFreshNotificationsSuccess,
  resetNotificationsError,
  resetNotificationsSuccess,
} from './actions';

export function* loadFreshNotifications(action) {
  try {
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const freshNotifications = yield requestWrapper(
      'GET',
      `notifications/total/${action.userId}/`,
      null,
      currentUser.token,
    );

    if (freshNotifications.length !== 0) {
      yield put(loadFreshNotificationsSuccess(freshNotifications));
    } else {
      yield put(loadFreshNotificationsError(true));
    }
  } catch (err) {
    yield put(loadFreshNotificationsError(false));
  }
}

export function* resetNotifications(action) {
  try {
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const resetNotifications = yield requestWrapper(
      'GET',
      `notifications/reset/${action.userId}/`,
      null,
      currentUser.token,
    );
    if (resetNotifications) {
      yield put(resetNotificationsSuccess(resetNotifications));
    } else {
      yield put(resetNotificationsError(true));
    }
  } catch (err) {
    yield put(resetNotificationsError(false));
  }
}

export default function* mainLayoutSaga() {
  yield takeLatest(LOAD_FRESH_NOTIFICATIONS, loadFreshNotifications);
  yield takeLatest(RESET_NOTIFICATIONS, resetNotifications);
}
