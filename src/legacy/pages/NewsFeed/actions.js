/*
 *
 * NewsFeedList actions
 *
 */

import * as CONSTANS from './constants';

export function defaultAction() {
  return {
    type: CONSTANS.DEFAULT_ACTION,
  };
}
export function flush() {
  return {
    type: CONSTANS.FLUSH,
  };
}

export function updateLikes(publication) {
  return {
    type: CONSTANS.UPDATE_LIKES,
    publication,
  };
}
export function setNoMore(entity) {
  return {
    type: CONSTANS.SET_NO_MORE,
    entity,
  };
}

export function loadEvents(page) {
  return {
    type: CONSTANS.LOAD_EVENTS,
    page,
  };
}

export function loadEventsSuccess(events) {
  return {
    type: CONSTANS.LOAD_EVENTS_SUCCESS,
    events,
  };
}

export function loadEventsError(error) {
  return {
    type: CONSTANS.LOAD_EVENTS_ERROR,
    error,
  };
}

export function loadPosts(page) {
  return {
    type: CONSTANS.LOAD_POSTS,
    page,
  };
}

export function loadPostsSuccess(posts, page) {
  return {
    type: CONSTANS.LOAD_POSTS_SUCCESS,
    posts,
    page,
  };
}

export function loadPostsError(error) {
  return {
    type: CONSTANS.LOAD_POSTS_ERROR,
    error,
  };
}

export function uploadImages(images) {
  return {
    type: CONSTANS.UPLOAD_IMAGES,
    images,
  };
}

export function uploadImagesSuccess(uploadImages) {
  return {
    type: CONSTANS.UPLOAD_IMAGES_SUCCESS,
    uploadImages,
  };
}

export function postPublication(publication) {
  return {
    type: CONSTANS.POST_PUBLICATION,
    publication,
  };
}

export function postPublicationSuccess(publication) {
  return {
    type: CONSTANS.POST_PUBLICATION_SUCCESS,
    publication,
  };
}

export function postPublicationError(error) {
  return {
    type: CONSTANS.POST_PUBLICATION_ERROR,
    error,
  };
}

export function setDeletedPostAction(deletedPosts) {
  return {
    type: CONSTANS.SET_DELETED_POSTS,
    deletedPosts,
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

export function setReportPopup({ opened, _id }) {
  return {
    type: CONSTANS.SET_REPORT_POPOP,
    opened,
    _id
  };
}
