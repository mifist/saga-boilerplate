import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadHiddenPosts() {
  return {
    type: CONSTANS.LOAD_HIDDEN_POSTS,
  };
}

export function loadHiddenPostsSuccess(hiddenPosts) {
  return {
    type: CONSTANS.LOAD_HIDDEN_POSTS_SUCCESS,
    hiddenPosts,
  };
}

export function loadHiddenPostsError(error) {
  return {
    type: CONSTANS.LOAD_HIDDEN_POSTS_ERROR,
    error,
  };
}

// UNHIDE POST
export function unhidePost(postId) {
  return {
    type: CONSTANS.UNHIDE_POST,
    postId,
  };
}
export function unhidePostSuccess(postId) {
  return {
    type: CONSTANS.UNHIDE_POST_SUCCESS,
    postId,
  };
}
export function unhidePostError(error) {
  return {
    type: CONSTANS.UNHIDE_POST_ERROR,
    error,
  };
}
