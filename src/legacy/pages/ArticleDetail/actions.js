import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// LOAD ARTICLE
export function loadArticle(id) {
  return {
    type: CONSTANTS.LOAD_ARTICLE,
    id,
  };
}

export function loadArticleSuccess(article) {
  return {
    type: CONSTANTS.LOAD_ARTICLE_SUCCESS,
    article,
  };
}

export function loadArticleError(error) {
  return {
    type: CONSTANTS.LOAD_ARTICLE_ERROR,
    error,
  };
}

// UPDATE_ARTICLE
export function updateArticle(data, actionType) {
  return {
    type: CONSTANTS.UPDATE_ARTICLE,
    data,
    actionType,
  };
}

export function updateArticleSuccess(article) {
  return {
    type: CONSTANTS.UPDATE_ARTICLE_SUCCESS,
    article,
  };
}

export function updateArticleError(error) {
  return {
    type: CONSTANTS.UPDATE_ARTICLE_ERROR,
    error,
  };
}

// DELETE ARTICLE
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
