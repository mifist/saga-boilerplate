/*
 *
 * EventDetail actions
 *
 */

import * as CONSTANTS from './constants';

import { notification } from 'antd';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadEvent(id) {
  return {
    type: CONSTANTS.LOAD_EVENT,
    id,
  };
}

export function loadEventSuccess(event) {
  return {
    type: CONSTANTS.LOAD_EVENT_SUCCESS,
    event,
  };
}

export function loadEventError(error) {
  return {
    type: CONSTANTS.LOAD_EVENT_ERROR,
    error,
  };
}

export function registerEvent({ id, userId, eventType }) {
  return {
    type: CONSTANTS.REGISTER_EVENT,
    id,
    userId,
    eventType,
  };
}

export function registerEventSuccess(result) {
  return {
    type: CONSTANTS.REGISTER_EVENT_SUCCESS,
    result,
  };
}

export function registerEventError(error) {
  return {
    type: CONSTANTS.REGISTER_EVENT_ERROR,
    error,
  };
}

export function watchEvent({ id, userId, eventType }) {
  return {
    type: CONSTANTS.WATCH_EVENT,
    id,
    userId,
    eventType,
  };
}

export function watchEventSuccess(eventUrl) {
  return {
    type: CONSTANTS.WATCH_EVENT_SUCCESS,
    eventUrl,
  };
}

export function watchEventError(error) {
  return {
    type: CONSTANTS.WATCH_EVENT_ERROR,
    error,
  };
}

export function closeLiveEventPopup() {
  return {
    type: CONSTANTS.CLOSE_LIVE_EVENT_POPUP,
  };
}
