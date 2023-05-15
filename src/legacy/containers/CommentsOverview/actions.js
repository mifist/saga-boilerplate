/*
 *
 * CaseOverview actions
 *
 */

import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

// Load Case Comments
export function loadComments(id, commentType) {
  return {
    type: CONSTANS.LOAD_COMMENTS,
    id,
    commentType,
  };
}
export function loadCommentsSuccess(comments) {
  return {
    type: CONSTANS.LOAD_COMMENTS_SUCCESS,
    comments,
  };
}
export function loadCommentsError(error) {
  return {
    type: CONSTANS.LOAD_COMMENTS_ERROR,
    error,
  };
}

export function reportPost(data) {
  return {
    type: CONSTANS.REPORT_POST,
    data,
  };
}

export function reportPostSuccess() {
  return {
    type: CONSTANS.REPORT_POST_SUCCESS,
  };
}

export function reportPostError(error) {
  return {
    type: CONSTANS.REPORT_POST_ERROR,
    error,
  };
}

export function setReportPopupOpened(opened) {
  return {
    type: CONSTANS.SET_REPORT_POPOP_OPENED,
    opened,
  };
}

export function modifyPostType(data) {
  return {
    type: CONSTANS.MODIFY_POST_TYPE,
    data,
  };
}

export function modifyPostTypeSuccess() {
  return {
    type: CONSTANS.MODIFY_POST_TYPE_SUCCESS,
  };
}

export function modifyPostTypeError(error) {
  return {
    type: CONSTANS.MODIFY_POST_TYPE_ERROR,
    error,
  };
}

export function setModifyPostTypePopupOpened(opened) {
  return {
    type: CONSTANS.SET_MODIFY_POST_TYPE_POPOP_OPENED,
    opened,
  };
}

export function updateCommentList(actionType, data) {
  return {
    type: CONSTANS.UPDATE_COMMENT_LIST,
    actionType,
    data,
  };
}
