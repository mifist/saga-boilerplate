/*
 *
 * CaseOverview actions
 *
 */

import {
  FLUSH_STATE,
  LOAD_COMMENTS,
  LOAD_COMMENTS_ERROR,
  LOAD_COMMENTS_SUCCESS,
  UPGRADE_COMMENT_ERROR,
  UPGRADE_COMMENT_SUCCESS,
  REPORT_POST,
  REPORT_POST_ERROR,
  REPORT_POST_SUCCESS,
  SET_REPORT_POPOP_OPENED,
  MODIFY_POST_TYPE,
  MODIFY_POST_TYPE_ERROR,
  MODIFY_POST_TYPE_SUCCESS,
  SET_MODIFY_POST_TYPE_POPOP_OPENED,
  UPDATE_COMMENT_LIST,
} from './constants';

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

/**
export function changeData(filteredProperties) {
  return {
    type: CHANGE_DATA,
    filteredProperties,
  };
} */

// Load Case Comments
export function loadComments(id, commentType) {
  return {
    type: LOAD_COMMENTS,
    id,
    commentType,
  };
}
export function loadCommentsSuccess(comments) {
  return {
    type: LOAD_COMMENTS_SUCCESS,
    comments,
  };
}
export function loadCommentsError(error) {
  return {
    type: LOAD_COMMENTS_ERROR,
    error,
  };
}

export function reportPost(data) {
  return {
    type: REPORT_POST,
    data,
  };
}

export function reportPostSuccess() {
  return {
    type: REPORT_POST_SUCCESS,
  };
}

export function reportPostError(error) {
  return {
    type: REPORT_POST_ERROR,
    error,
  };
}

export function setReportPopupOpened(opened) {
  return {
    type: SET_REPORT_POPOP_OPENED,
    opened,
  };
}

export function modifyPostType(data) {
  return {
    type: MODIFY_POST_TYPE,
    data,
  };
}

export function modifyPostTypeSuccess() {
  return {
    type: MODIFY_POST_TYPE_SUCCESS,
  };
}

export function modifyPostTypeError(error) {
  return {
    type: MODIFY_POST_TYPE_ERROR,
    error,
  };
}

export function setModifyPostTypePopupOpened(opened) {
  return {
    type: SET_MODIFY_POST_TYPE_POPOP_OPENED,
    opened,
  };
}

export function updateCommentList(actionType, data) {
  return {
    type: UPDATE_COMMENT_LIST,
    actionType,
    data,
  };
}
