import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadCase(id) {
  return {
    type: CONSTANS.LOAD_CASE,
    id,
  };
}

export function loadCaseSuccess(caseData) {
  return {
    type: CONSTANS.LOAD_CASE_SUCCESS,
    caseData,
  };
}

export function loadCaseError(error) {
  return {
    type: CONSTANS.LOAD_CASE_ERROR,
    error,
  };
}

// UPDATE CASE
export function updateCase(data, actionType) {
  return {
    type: CONSTANS.UPDATE_CASE,
    data,
    actionType,
  };
}

export function updateCaseSuccess(caseData) {
  return {
    type: CONSTANS.UPDATE_CASE_SUCCESS,
    caseData,
  };
}

export function updateCaseError(error) {
  return {
    type: CONSTANS.UPDATE_CASE_ERROR,
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

export function loadCommunityTags(id) {
  return {
    type: CONSTANS.LOAD_COMMUNITY_TAGS,
    id,
  };
}

export function loadCommunityTagsSuccess(communityTags) {
  return {
    type: CONSTANS.LOAD_COMMUNITY_TAGS_SUCCESS,
    communityTags,
  };
}

export function loadCommunityTagsError(errorTags) {
  return {
    type: CONSTANS.LOAD_COMMUNITY_TAGS_ERROR,
    errorTags,
  };
}
