/*
 *
 * EventDetail actions
 *
 */

import * as CONSTANS from './constants';

import { notification } from 'antd';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadEvent(id) {
  return {
    type: CONSTANS.LOAD_EVENT,
    id,
  };
}

export function loadEventSuccess(event) {
  return {
    type: CONSTANS.LOAD_EVENT_SUCCESS,
    event,
  };
}

export function loadEventError(error) {
  return {
    type: CONSTANS.LOAD_EVENT_ERROR,
    error,
  };
}

export function registerEvent({ id, userId, eventType }) {
  return {
    type: CONSTANS.REGISTER_EVENT,
    id,
    userId,
    eventType,
  };
}

export function registerEventSuccess(result) {
  return {
    type: CONSTANS.REGISTER_EVENT_SUCCESS,
    result,
  };
}

export function registerEventError(error) {
  return {
    type: CONSTANS.REGISTER_EVENT_ERROR,
    error,
  };
}

export function watchEvent({ id, userId, eventType }) {
  return {
    type: CONSTANS.WATCH_EVENT,
    id,
    userId,
    eventType,
  };
}

export function watchEventSuccess(eventUrl) {
  return {
    type: CONSTANS.WATCH_EVENT_SUCCESS,
    eventUrl,
  };
}

export function watchEventError(error) {
  return {
    type: CONSTANS.WATCH_EVENT_ERROR,
    error,
  };
}

export function closeLiveEventPopup() {
  return {
    type: CONSTANS.CLOSE_LIVE_EVENT_POPUP,
  };
}
