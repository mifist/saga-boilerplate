import {
  FLUSH_STATE,
  LOAD_CASE,
  LOAD_CASE_ERROR,
  LOAD_CASE_SUCCESS,
  UPDATE_CASE,
  UPDATE_CASE_ERROR,
  UPDATE_CASE_SUCCESS,
  ON_DELETE,
  ON_DELETE_SUCCESS,
  PIN_UNPIN_POST,
  PIN_UNPIN_POST_SUCCESS,
  PIN_UNPIN_POST_ERROR,
  HIDE_UNHIDE_POST,
  HIDE_UNHIDE_POST_SUCCESS,
  HIDE_UNHIDE_POST_ERROR,
  LOAD_COMMUNITY_TAGS,
  LOAD_COMMUNITY_TAGS_SUCCESS,
  LOAD_COMMUNITY_TAGS_ERROR,
} from './constants';

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

export function loadCase(id) {
  return {
    type: LOAD_CASE,
    id,
  };
}

export function loadCaseSuccess(caseData) {
  return {
    type: LOAD_CASE_SUCCESS,
    caseData,
  };
}

export function loadCaseError(error) {
  return {
    type: LOAD_CASE_ERROR,
    error,
  };
}

// UPDATE CASE
export function updateCase(data, actionType) {
  return {
    type: UPDATE_CASE,
    data,
    actionType,
  };
}

export function updateCaseSuccess(caseData) {
  return {
    type: UPDATE_CASE_SUCCESS,
    caseData,
  };
}

export function updateCaseError(error) {
  return {
    type: UPDATE_CASE_ERROR,
    error,
  };
}

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

export function loadCommunityTags(id) {
  return {
    type: LOAD_COMMUNITY_TAGS,
    id,
  };
}

export function loadCommunityTagsSuccess(communityTags) {
  return {
    type: LOAD_COMMUNITY_TAGS_SUCCESS,
    communityTags,
  };
}

export function loadCommunityTagsError(errorTags) {
  return {
    type: LOAD_COMMUNITY_TAGS_ERROR,
    errorTags,
  };
}
