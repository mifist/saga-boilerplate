import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadHiddenPosts() {
  return {
    type: CONSTANTS.LOAD_HIDDEN_POSTS,
  };
}

export function loadHiddenPostsSuccess(hiddenPosts) {
  return {
    type: CONSTANTS.LOAD_HIDDEN_POSTS_SUCCESS,
    hiddenPosts,
  };
}

export function loadHiddenPostsError(error) {
  return {
    type: CONSTANTS.LOAD_HIDDEN_POSTS_ERROR,
    error,
  };
}

// UNHIDE POST
export function unhidePost(postId) {
  return {
    type: CONSTANTS.UNHIDE_POST,
    postId,
  };
}
export function unhidePostSuccess(postId) {
  return {
    type: CONSTANTS.UNHIDE_POST_SUCCESS,
    postId,
  };
}
export function unhidePostError(error) {
  return {
    type: CONSTANTS.UNHIDE_POST_ERROR,
    error,
  };
}
