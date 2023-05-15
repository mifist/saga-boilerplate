import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

// LOAD PODCASTS
export function loadPodcasts(filter) {
  return {
    type: CONSTANS.LOAD_PODCASTS,
    filter,
  };
}

export function loadPodcastsSuccess(podcasts) {
  return {
    type: CONSTANS.LOAD_PODCASTS_SUCCESS,
    podcasts,
  };
}

export function loadPodcastsError(error) {
  return {
    type: CONSTANS.LOAD_PODCASTS_ERROR,
    error,
  };
}

// CREATE PODCAST
export function createPodcast(data) {
  return {
    type: CONSTANS.CREATE_PODCAST,
    data,
  };
}
export function createPodcastSuccess(data) {
  return {
    type: CONSTANS.CREATE_PODCAST_SUCCESS,
    data,
  };
}

export function createPodcastError(error) {
  return {
    type: CONSTANS.CREATE_PODCAST_ERROR,
    error,
  };
}
