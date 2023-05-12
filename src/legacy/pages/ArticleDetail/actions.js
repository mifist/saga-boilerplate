import {
  UPDATE_ARTICLE,
  UPDATE_ARTICLE_ERROR,
  UPDATE_ARTICLE_SUCCESS,
  FLUSH_STATE,
  LOAD_ARTICLE,
  LOAD_ARTICLE_ERROR,
  LOAD_ARTICLE_SUCCESS,
  ON_DELETE,
  ON_DELETE_SUCCESS,
  PIN_UNPIN_POST,
  PIN_UNPIN_POST_SUCCESS,
  PIN_UNPIN_POST_ERROR,
  HIDE_UNHIDE_POST,
  HIDE_UNHIDE_POST_SUCCESS,
  HIDE_UNHIDE_POST_ERROR,
} from './constants';

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

// LOAD ARTICLE
export function loadArticle(id) {
  return {
    type: LOAD_ARTICLE,
    id,
  };
}

export function loadArticleSuccess(article) {
  return {
    type: LOAD_ARTICLE_SUCCESS,
    article,
  };
}

export function loadArticleError(error) {
  return {
    type: LOAD_ARTICLE_ERROR,
    error,
  };
}

// UPDATE_ARTICLE
export function updateArticle(data, actionType) {
  return {
    type: UPDATE_ARTICLE,
    data,
    actionType,
  };
}

export function updateArticleSuccess(article) {
  return {
    type: UPDATE_ARTICLE_SUCCESS,
    article,
  };
}

export function updateArticleError(error) {
  return {
    type: UPDATE_ARTICLE_ERROR,
    error,
  };
}

// DELETE ARTICLE
export function onDelete(id) {
  return {
    type: ON_DELETE,
    id,
  };
}
export function onDeleteSuccess() {
  return {
    type: ON_DELETE_SUCCESS,
  };
}

// PIN UNPIN POST
export function pinUnpinPost(postId, pinned) {
  return {
    type: PIN_UNPIN_POST,
    postId,
    pinned,
  };
}

export function pinUnpinPostSuccess(pinned) {
  return {
    type: PIN_UNPIN_POST_SUCCESS,
    pinned,
  };
}

export function pinUnpinPostError(error) {
  return {
    type: PIN_UNPIN_POST_ERROR,
    error,
  };
}

// HIDE UNHIDE POST
export function hideUnhidePost(postId, hidden) {
  return {
    type: HIDE_UNHIDE_POST,
    postId,
    hidden,
  };
}

export function hideUnhidePostSuccess(hidden) {
  return {
    type: HIDE_UNHIDE_POST_SUCCESS,
    hidden,
  };
}

export function hideUnhidePostError(error) {
  return {
    type: HIDE_UNHIDE_POST_ERROR,
    error,
  };
}
