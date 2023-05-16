/*
 *
 * NewsFeedList actions
 *
 */

import * as CONSTANTS from './constants';

export function defaultAction() {
  return {
    type: CONSTANTS.DEFAULT_ACTION,
  };
}
export function flush() {
  return {
    type: CONSTANTS.FLUSH,
  };
}

export function updateLikes(publication) {
  return {
    type: CONSTANTS.UPDATE_LIKES,
    publication,
  };
}
export function setNoMore(entity) {
  return {
    type: CONSTANTS.SET_NO_MORE,
    entity,
  };
}

export function loadEvents(page) {
  return {
    type: CONSTANTS.LOAD_EVENTS,
    page,
  };
}

export function loadEventsSuccess(events) {
  return {
    type: CONSTANTS.LOAD_EVENTS_SUCCESS,
    events,
  };
}

export function loadEventsError(error) {
  return {
    type: CONSTANTS.LOAD_EVENTS_ERROR,
    error,
  };
}

export function loadPosts(page) {
  return {
    type: CONSTANTS.LOAD_POSTS,
    page,
  };
}

export function loadPostsSuccess(posts, page) {
  return {
    type: CONSTANTS.LOAD_POSTS_SUCCESS,
    posts,
    page,
  };
}

export function loadPostsError(error) {
  return {
    type: CONSTANTS.LOAD_POSTS_ERROR,
    error,
  };
}

export function uploadImages(images) {
  return {
    type: CONSTANTS.UPLOAD_IMAGES,
    images,
  };
}

export function uploadImagesSuccess(uploadImages) {
  return {
    type: CONSTANTS.UPLOAD_IMAGES_SUCCESS,
    uploadImages,
  };
}

export function postPublication(publication) {
  return {
    type: CONSTANTS.POST_PUBLICATION,
    publication,
  };
}

export function postPublicationSuccess(publication) {
  return {
    type: CONSTANTS.POST_PUBLICATION_SUCCESS,
    publication,
  };
}

export function postPublicationError(error) {
  return {
    type: CONSTANTS.POST_PUBLICATION_ERROR,
    error,
  };
}

export function setDeletedPostAction(deletedPosts) {
  return {
    type: CONSTANTS.SET_DELETED_POSTS,
    deletedPosts,
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

export function setReportPopup({ opened, _id }) {
  return {
    type: CONSTANTS.SET_REPORT_POPOP,
    opened,
    _id,
  };
}
