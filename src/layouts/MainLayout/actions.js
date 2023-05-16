/*
 *
 * MainLayout actions
 *
 */

import { FLUSH_STATE } from './constants';
import {
  LOAD_FRESH_NOTIFICATIONS,
  LOAD_FRESH_NOTIFICATIONS_ERROR,
  LOAD_FRESH_NOTIFICATIONS_SUCCESS,
  RESET_NOTIFICATIONS,
  RESET_NOTIFICATIONS_ERROR,
  RESET_NOTIFICATIONS_SUCCESS,
} from '../../legacy/pages/Notifications/constants';

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

export function resetNotifications(userId) {
  return {
    type: RESET_NOTIFICATIONS,
    userId,
  };
}

export function resetNotificationsSuccess(resetNotifications) {
  return {
    type: RESET_NOTIFICATIONS_SUCCESS,
    resetNotifications,
  };
}

export function resetNotificationsError(error) {
  return {
    type: RESET_NOTIFICATIONS_ERROR,
    error,
  };
}

export function loadFreshNotifications(userId) {
  return {
    type: LOAD_FRESH_NOTIFICATIONS,
    userId,
  };
}

export function loadFreshNotificationsSuccess(freshNotifications) {
  return {
    type: LOAD_FRESH_NOTIFICATIONS_SUCCESS,
    freshNotifications,
  };
}

export function loadFreshNotificationsError(error) {
  return {
    type: LOAD_FRESH_NOTIFICATIONS_ERROR,
    error,
  };
}
