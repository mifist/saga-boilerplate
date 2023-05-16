/*
 *
 * Notifications actions
 *
 */
import * as CONSTANTS from './constants';

export function setNoMore() {
  return {
    type: CONSTANTS.SET_NO_MORE,
  };
}

export function flush() {
  return {
    type: CONSTANTS.FLUSH,
  };
}

export function loadNotifications(page, userId) {
  return {
    type: CONSTANTS.LOAD_NOTIFICATIONS,
    page,
    userId,
  };
}

export function loadNotificationsSuccess(notifications, totalCount) {
  return {
    type: CONSTANTS.LOAD_NOTIFICATIONS_SUCCESS,
    notifications,
    totalCount,
  };
}

export function loadNotificationsError(error) {
  return {
    type: CONSTANTS.LOAD_NOTIFICATIONS_ERROR,
    error,
  };
}

export function updateNotification(notification) {
  return {
    type: CONSTANTS.UPDATE_NOTIFICATION,
    notification,
  };
}

export function updateNotificationSuccess(notification) {
  return {
    type: CONSTANTS.UPDATE_NOTIFICATION_SUCCESS,
    notification,
  };
}

export function updateNotificationError(error) {
  return {
    type: CONSTANTS.UPDATE_NOTIFICATION_ERROR,
    error,
  };
}
