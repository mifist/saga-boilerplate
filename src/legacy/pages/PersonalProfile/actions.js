/*
 *
 * PersonalProfile actions
 *
 */
import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadProfile(id) {
  return {
    type: CONSTANTS.LOAD_PROFILE,
    id,
  };
}

export function loadProfileSuccess(profile) {
  return {
    type: CONSTANTS.LOAD_PROFILE_SUCCESS,
    profile,
  };
}

export function loadProfileError(error) {
  return {
    type: CONSTANTS.LOAD_PROFILE_ERROR,
    error,
  };
}

export function loadEvents() {
  return {
    type: CONSTANTS.LOAD_EVENTS,
  };
}

export function loadEventsSuccess(dataTab) {
  return {
    type: CONSTANTS.LOAD_EVENTS_SUCCESS,
    dataTab,
  };
}

export function loadEventsError(error) {
  return {
    type: CONSTANTS.LOAD_EVENTS_ERROR,
    error,
  };
}
