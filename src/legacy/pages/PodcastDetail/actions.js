import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

// LOAD PODCAST
export function loadPodcast(id) {
  return {
    type: CONSTANS.LOAD_PODCAST,
    id,
  };
}

export function loadPodcastSuccess(podcast) {
  return {
    type: CONSTANS.LOAD_PODCAST_SUCCESS,
    podcast,
  };
}

export function loadPodcastError(error) {
  return {
    type: CONSTANS.LOAD_PODCAST_ERROR,
    error,
  };
}

// UPDATE PODCAST
export function updatePodcast(data, actionType) {
  return {
    type: CONSTANS.UPDATE_PODCAST,
    data,
    actionType,
  };
}

export function updatePodcastSuccess(podcast) {
  return {
    type: CONSTANS.UPDATE_PODCAST_SUCCESS,
    podcast,
  };
}

export function updatePodcastError(error) {
  return {
    type: CONSTANS.UPDATE_PODCAST_ERROR,
    error,
  };
}

export function onDelete(id) {
  return {
    type: CONSTANS.ON_DELETE,
    id,
  };
}
export function onDeleteSuccess() {
  return {
    type: CONSTANS.ON_DELETE_SUCCESS,
  };
}

// PIN UNPIN POST
export function pinUnpinPost(postId, pinned) {
  return {
    type: CONSTANS.PIN_UNPIN_POST,
    postId,
    pinned,
  };
}

export function pinUnpinPostSuccess(pinned) {
  return {
    type: CONSTANS.PIN_UNPIN_POST_SUCCESS,
    pinned,
  };
}

export function pinUnpinPostError(error) {
  return {
    type: CONSTANS.PIN_UNPIN_POST_ERROR,
    error,
  };
}

// HIDE UNHIDE POST
export function hideUnhidePost(postId, hidden) {
  return {
    type: CONSTANS.HIDE_UNHIDE_POST,
    postId,
    hidden,
  };
}

export function hideUnhidePostSuccess(hidden) {
  return {
    type: CONSTANS.HIDE_UNHIDE_POST_SUCCESS,
    hidden,
  };
}

export function hideUnhidePostError(error) {
  return {
    type: CONSTANS.HIDE_UNHIDE_POST_ERROR,
    error,
  };
}
