import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// LOAD PODCASTS
export function loadPodcasts(filter) {
  return {
    type: CONSTANTS.LOAD_PODCASTS,
    filter,
  };
}

export function loadPodcastsSuccess(podcasts) {
  return {
    type: CONSTANTS.LOAD_PODCASTS_SUCCESS,
    podcasts,
  };
}

export function loadPodcastsError(error) {
  return {
    type: CONSTANTS.LOAD_PODCASTS_ERROR,
    error,
  };
}

// CREATE PODCAST
export function createPodcast(data) {
  return {
    type: CONSTANTS.CREATE_PODCAST,
    data,
  };
}
export function createPodcastSuccess(data) {
  return {
    type: CONSTANTS.CREATE_PODCAST_SUCCESS,
    data,
  };
}

export function createPodcastError(error) {
  return {
    type: CONSTANTS.CREATE_PODCAST_ERROR,
    error,
  };
}
