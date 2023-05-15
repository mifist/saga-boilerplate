/*
 *
 * Notifications actions
 *
 */
import * as CONSTANS from './constants';

export function setNoMore() {
  return {
    type: CONSTANS.SET_NO_MORE,
  };
}

export function flush() {
  return {
    type: CONSTANS.FLUSH,
  };
}

export function loadNotifications(page, userId) {
  return {
    type: CONSTANS.LOAD_NOTIFICATIONS,
    page,
    userId,
  };
}

export function loadNotificationsSuccess(notifications, totalCount) {
  return {
    type: CONSTANS.LOAD_NOTIFICATIONS_SUCCESS,
    notifications,
    totalCount,
  };
}

export function loadNotificationsError(error) {
  return {
    type: CONSTANS.LOAD_NOTIFICATIONS_ERROR,
    error,
  };
}

export function updateNotification(notification) {
  return {
    type: CONSTANS.UPDATE_NOTIFICATION,
    notification,
  };
}

export function updateNotificationSuccess(notification) {
  return {
    type: CONSTANS.UPDATE_NOTIFICATION_SUCCESS,
    notification,
  };
}

export function updateNotificationError(error) {
  return {
    type: CONSTANS.UPDATE_NOTIFICATION_ERROR,
    error,
  };
}
