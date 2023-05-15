/*
 *
 * NewsFeedList actions
 *
 */

import * as CONSTANS from './constants';
export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadUpcoming(params) {
  return {
    type: CONSTANS.LOAD_UPCOMING,
    params,
  };
}

export function loadUpcomingSuccess(eventsUpcoming) {
  return {
    type: CONSTANS.LOAD_UPCOMING_SUCCESS,
    eventsUpcoming,
  };
}

export function loadUpcomingError(error) {
  return {
    type: CONSTANS.LOAD_UPCOMING_ERROR,
    error,
  };
}
export function loadReplay(params) {
  return {
    type: CONSTANS.LOAD_REPLAY,
    params,
  };
}

export function loadReplaySuccess(eventsReplay) {
  return {
    type: CONSTANS.LOAD_REPLAY_SUCCESS,
    eventsReplay,
  };
}

export function loadReplayError(errorReplay) {
  return {
    type: CONSTANS.LOAD_REPLAY_ERROR,
    errorReplay,
  };
}
