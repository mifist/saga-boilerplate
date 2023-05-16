import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadCase(id) {
  return {
    type: CONSTANTS.LOAD_CASE,
    id,
  };
}

export function loadCaseSuccess(caseData) {
  return {
    type: CONSTANTS.LOAD_CASE_SUCCESS,
    caseData,
  };
}

export function loadCaseError(error) {
  return {
    type: CONSTANTS.LOAD_CASE_ERROR,
    error,
  };
}

// UPDATE CASE
export function updateCase(data, actionType) {
  return {
    type: CONSTANTS.UPDATE_CASE,
    data,
    actionType,
  };
}

export function updateCaseSuccess(caseData) {
  return {
    type: CONSTANTS.UPDATE_CASE_SUCCESS,
    caseData,
  };
}

export function updateCaseError(error) {
  return {
    type: CONSTANTS.UPDATE_CASE_ERROR,
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

export function loadCommunityTags(id) {
  return {
    type: CONSTANTS.LOAD_COMMUNITY_TAGS,
    id,
  };
}

export function loadCommunityTagsSuccess(communityTags) {
  return {
    type: CONSTANTS.LOAD_COMMUNITY_TAGS_SUCCESS,
    communityTags,
  };
}

export function loadCommunityTagsError(errorTags) {
  return {
    type: CONSTANTS.LOAD_COMMUNITY_TAGS_ERROR,
    errorTags,
  };
}
