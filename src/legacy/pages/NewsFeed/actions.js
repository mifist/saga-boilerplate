/*
 *
 * NewsFeedList actions
 *
 */

import {
  DEFAULT_ACTION,
  FLUSH,
  LOAD_EVENTS,
  LOAD_EVENTS_ERROR,
  LOAD_EVENTS_SUCCESS,
  LOAD_POSTS,
  LOAD_POSTS_ERROR,
  LOAD_POSTS_SUCCESS,
  POST_PUBLICATION,
  POST_PUBLICATION_ERROR,
  POST_PUBLICATION_SUCCESS,
  SET_NO_MORE,
  UPDATE_LIKES,
  UPLOAD_IMAGES,
  UPLOAD_IMAGES_SUCCESS,
  SET_DELETED_POSTS,
  REPORT_POST,
  REPORT_POST_ERROR,
  REPORT_POST_SUCCESS,
  SET_REPORT_POPOP,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function flush() {
  return {
    type: FLUSH,
  };
}

export function updateLikes(publication) {
  return {
    type: UPDATE_LIKES,
    publication,
  };
}
export function setNoMore(entity) {
  return {
    type: SET_NO_MORE,
    entity,
  };
}

export function loadEvents(page) {
  return {
    type: LOAD_EVENTS,
    page,
  };
}

export function loadEventsSuccess(events) {
  return {
    type: LOAD_EVENTS_SUCCESS,
    events,
  };
}

export function loadEventsError(error) {
  return {
    type: LOAD_EVENTS_ERROR,
    error,
  };
}

export function loadPosts(page) {
  return {
    type: LOAD_POSTS,
    page,
  };
}

export function loadPostsSuccess(posts, page) {
  return {
    type: LOAD_POSTS_SUCCESS,
    posts,
    page,
  };
}

export function loadPostsError(error) {
  return {
    type: LOAD_POSTS_ERROR,
    error,
  };
}

export function uploadImages(images) {
  return {
    type: UPLOAD_IMAGES,
    images,
  };
}

export function uploadImagesSuccess(uploadImages) {
  return {
    type: UPLOAD_IMAGES_SUCCESS,
    uploadImages,
  };
}

export function postPublication(publication) {
  return {
    type: POST_PUBLICATION,
    publication,
  };
}

export function postPublicationSuccess(publication) {
  return {
    type: POST_PUBLICATION_SUCCESS,
    publication,
  };
}

export function postPublicationError(error) {
  return {
    type: POST_PUBLICATION_ERROR,
    error,
  };
}

export function setDeletedPostAction(deletedPosts) {
  return {
    type: SET_DELETED_POSTS,
    deletedPosts,
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

export function setReportPopup({ opened, _id }) {
  return {
    type: SET_REPORT_POPOP,
    opened,
    _id
  };
}
