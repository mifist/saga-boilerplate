/*
 *
 * NewsFeedList actions
 *
 */

import * as CONSTANTS from './constants';
export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadUpcoming(params) {
  return {
    type: CONSTANTS.LOAD_UPCOMING,
    params,
  };
}

export function loadUpcomingSuccess(eventsUpcoming) {
  return {
    type: CONSTANTS.LOAD_UPCOMING_SUCCESS,
    eventsUpcoming,
  };
}

export function loadUpcomingError(error) {
  return {
    type: CONSTANTS.LOAD_UPCOMING_ERROR,
    error,
  };
}
export function loadReplay(params) {
  return {
    type: CONSTANTS.LOAD_REPLAY,
    params,
  };
}

export function loadReplaySuccess(eventsReplay) {
  return {
    type: CONSTANTS.LOAD_REPLAY_SUCCESS,
    eventsReplay,
  };
}

export function loadReplayError(errorReplay) {
  return {
    type: CONSTANTS.LOAD_REPLAY_ERROR,
    errorReplay,
  };
}
