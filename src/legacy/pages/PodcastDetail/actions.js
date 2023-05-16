import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// LOAD PODCAST
export function loadPodcast(id) {
  return {
    type: CONSTANTS.LOAD_PODCAST,
    id,
  };
}

export function loadPodcastSuccess(podcast) {
  return {
    type: CONSTANTS.LOAD_PODCAST_SUCCESS,
    podcast,
  };
}

export function loadPodcastError(error) {
  return {
    type: CONSTANTS.LOAD_PODCAST_ERROR,
    error,
  };
}

// UPDATE PODCAST
export function updatePodcast(data, actionType) {
  return {
    type: CONSTANTS.UPDATE_PODCAST,
    data,
    actionType,
  };
}

export function updatePodcastSuccess(podcast) {
  return {
    type: CONSTANTS.UPDATE_PODCAST_SUCCESS,
    podcast,
  };
}

export function updatePodcastError(error) {
  return {
    type: CONSTANTS.UPDATE_PODCAST_ERROR,
    error,
  };
}

export function onDelete(id) {
  return {
    type: CONSTANTS.ON_DELETE,
    id,
  };
}
export function onDeleteSuccess() {
  return {
    type: CONSTANTS.ON_DELETE_SUCCESS,
  };
}

// PIN UNPIN POST
export function pinUnpinPost(postId, pinned) {
  return {
    type: CONSTANTS.PIN_UNPIN_POST,
    postId,
    pinned,
  };
}

export function pinUnpinPostSuccess(pinned) {
  return {
    type: CONSTANTS.PIN_UNPIN_POST_SUCCESS,
    pinned,
  };
}

export function pinUnpinPostError(error) {
  return {
    type: CONSTANTS.PIN_UNPIN_POST_ERROR,
    error,
  };
}

// HIDE UNHIDE POST
export function hideUnhidePost(postId, hidden) {
  return {
    type: CONSTANTS.HIDE_UNHIDE_POST,
    postId,
    hidden,
  };
}

export function hideUnhidePostSuccess(hidden) {
  return {
    type: CONSTANTS.HIDE_UNHIDE_POST_SUCCESS,
    hidden,
  };
}

export function hideUnhidePostError(error) {
  return {
    type: CONSTANTS.HIDE_UNHIDE_POST_ERROR,
    error,
  };
}
