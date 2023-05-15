/*
 *
 * PersonalProfile actions
 *
 */
import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadProfile(id) {
  return {
    type: CONSTANS.LOAD_PROFILE,
    id,
  };
}

export function loadProfileSuccess(profile) {
  return {
    type: CONSTANS.LOAD_PROFILE_SUCCESS,
    profile,
  };
}

export function loadProfileError(error) {
  return {
    type: CONSTANS.LOAD_PROFILE_ERROR,
    error,
  };
}

export function loadEvents() {
  return {
    type: CONSTANS.LOAD_EVENTS
  };
}

export function loadEventsSuccess(dataTab) {
  return {
    type: CONSTANS.LOAD_EVENTS_SUCCESS,
    dataTab,
  };
}

export function loadEventsError(error) {
  return {
    type: CONSTANS.LOAD_EVENTS_ERROR,
    error,
  };
}
