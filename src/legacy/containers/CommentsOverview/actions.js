/*
 *
 * CaseOverview actions
 *
 */

import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

// Load Case Comments
export function loadComments(id, commentType) {
  return {
    type: CONSTANTS.LOAD_COMMENTS,
    id,
    commentType,
  };
}
export function loadCommentsSuccess(comments) {
  return {
    type: CONSTANTS.LOAD_COMMENTS_SUCCESS,
    comments,
  };
}
export function loadCommentsError(error) {
  return {
    type: CONSTANTS.LOAD_COMMENTS_ERROR,
    error,
  };
}

export function reportPost(data) {
  return {
    type: CONSTANTS.REPORT_POST,
    data,
  };
}

export function reportPostSuccess() {
  return {
    type: CONSTANTS.REPORT_POST_SUCCESS,
  };
}

export function reportPostError(error) {
  return {
    type: CONSTANTS.REPORT_POST_ERROR,
    error,
  };
}

export function setReportPopupOpened(opened) {
  return {
    type: CONSTANTS.SET_REPORT_POPOP_OPENED,
    opened,
  };
}

export function modifyPostType(data) {
  return {
    type: CONSTANTS.MODIFY_POST_TYPE,
    data,
  };
}

export function modifyPostTypeSuccess() {
  return {
    type: CONSTANTS.MODIFY_POST_TYPE_SUCCESS,
  };
}

export function modifyPostTypeError(error) {
  return {
    type: CONSTANTS.MODIFY_POST_TYPE_ERROR,
    error,
  };
}

export function setModifyPostTypePopupOpened(opened) {
  return {
    type: CONSTANTS.SET_MODIFY_POST_TYPE_POPOP_OPENED,
    opened,
  };
}

export function updateCommentList(actionType, data) {
  return {
    type: CONSTANTS.UPDATE_COMMENT_LIST,
    actionType,
    data,
  };
}
