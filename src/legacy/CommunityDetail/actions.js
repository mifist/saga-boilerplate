/*
 *
 * CommunityDetail actions
 *
 */

import {
  LOAD_COMMUNITYDETAIL,
  LOAD_COMMUNITYDETAIL_SUCCESS,
  LOAD_COMMUNITYDETAIL_ERROR,
  CHANGE_COMMUNITYDETAIL,
  CHANGE_COMMUNITYDETAIL_SUCCESS,
  CHANGE_COMMUNITYDETAIL_ERROR,
  DELETE_COMMUNITYDETAIL,
  DELETE_COMMUNITYDETAIL_SUCCESS,
  DELETE_COMMUNITYDETAIL_ERROR,
  // all tags for community
  LOAD_TAGS,
  LOAD_TAGS_SUCCESS,
  LOAD_TAGS_ERROR,
  // popular tags
  LOAD_COMMUNITYDETAIL_TAGS,
  LOAD_COMMUNITYDETAIL_TAGS_SUCCESS,
  LOAD_COMMUNITYDETAIL_TAGS_ERROR,
  // media
  UPLOAD_MEDIA,
  UPLOAD_MEDIA_SUCCESS,
  UPLOAD_MEDIA_ERROR,
  // feeds,
  LOAD_FEEDS,
  LOAD_FEEDS_SUCCESS,
  LOAD_FEEDS_ERROR,
  // post new ublication
  POST_PUBLICATION,
  POST_PUBLICATION_SUCCESS,
  POST_PUBLICATION_ERROR,
  // other
  FLUSH_STATE_COMMUNITYDETAIL,
  UPDATE_LIKES,
  REPORT_POST,
  REPORT_POST_ERROR,
  REPORT_POST_SUCCESS,
  SET_REPORT_POPOP,
} from './constants';

/**
 * Clearing the state for CommunityDetail
 */
export function flushStateCommunityDetail() {
  return {
    type: FLUSH_STATE_COMMUNITYDETAIL,
  };
}

/**
 * ------------------ LOAD ------------------
 */

/**
 * Load the CommunityDetail, this action starts the request saga
 *
 * @return {array} An action object with a type of LOAD_COMMUNITYDETAIL
 */
export function loadCommunityDetail(id) {
  return {
    type: LOAD_COMMUNITYDETAIL,
    id,
  };
}

/**
 * Dispatched when the loadCommunityDetail are loaded by the request saga
 *
 * @param  {array} variables true for CommunityDetail
 *
 * @return {array} An action object with a type of LOAD_COMMUNITYDETAIL_SUCCESS passing the variables
 */
export function loadCommunityDetailSuccess(communityDetailData) {
  return {
    type: LOAD_COMMUNITYDETAIL_SUCCESS,
    communityDetailData,
  };
}

/**
 * Dispatched when loading the loadCommunityDetail fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of LOAD_COMMUNITYDETAIL_ERROR passing the error
 */
export function loadCommunityDetailError(error) {
  return {
    type: LOAD_COMMUNITYDETAIL_ERROR,
    error,
  };
}

/**
 * ------------------ CHANGE ------------------
 */

export function updateLikesCommunity(publication) {
  return {
    type: UPDATE_LIKES,
    publication,
  };
}

/**
 * Change/Update the CommunityDetail, this action starts the request saga
 *
 * @return {array} An action object with a type of CHANGE_COMMUNITYDETAIL
 */
export function changeCommunityDetail(communityDetailData) {
  return {
    type: CHANGE_COMMUNITYDETAIL,
    communityDetailData,
  };
}

/**
 * Dispatched when the changeCommunityDetail are changed/updated by the request saga
 *
 * @param  {array} communityDetailData true for CommunityDetail
 *
 * @return {array} An action object with a type of CHANGE_COMMUNITYDETAIL_SUCCESS passing the variables
 */
export function changeCommunityDetailSuccess(communityDetailData) {
  return {
    type: CHANGE_COMMUNITYDETAIL_SUCCESS,
    communityDetailData,
  };
}

/**
 * Dispatched when loading the changeCommunityDetail fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of CHANGE_COMMUNITYDETAIL_ERROR passing the error
 */
export function changeCommunityDetailError(error) {
  return {
    type: CHANGE_COMMUNITYDETAIL_ERROR,
    error,
  };
}

/**
 * ------------------ DELETE ------------------
 */

/**
 * Delete the CommunityDetail, this action starts the request saga
 *
 * @return {object} An action object with a type of DELETE_COMMUNITYDETAIL
 */
export function deleteCommunityDetail(id) {
  return {
    type: DELETE_COMMUNITYDETAIL,
    id,
  };
}

/**
 * Dispatched when the deleteCommunityDetail are deleted by the request saga
 *
 * @param  {object} variables true for CommunityDetail
 *
 * @return {object} An action object with a type of DELETE_COMMUNITYDETAIL_SUCCESS passing the variables
 */
export function deleteCommunityDetailSuccess() {
  return {
    type: DELETE_COMMUNITYDETAIL_SUCCESS,
  };
}

/**
 * Dispatched when loading the deleteCommunityDetail fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of DELETE_COMMUNITYDETAIL_ERROR passing the error
 */
export function deleteCommunityDetailError(error) {
  return {
    type: DELETE_COMMUNITYDETAIL_ERROR,
    error,
  };
}

/**
 * ------------------ LOAD POPULAR TAGS ------------------
 */

/**
 * Load the communityDetailTags, this action starts the request saga
 *
 * @return {array} An action object with a type of LOAD_COMMUNITYDETAIL_TAGS
 */
export function loadCommunityDetailTags(id) {
  return {
    type: LOAD_COMMUNITYDETAIL_TAGS,
    id,
  };
}

/**
 * Dispatched when the loadCommunityDetailTags are loaded by the request saga
 *
 * @param  {array} communityPopularTags true for CommunityDetail
 *
 * @return {array} An action object with a type of LOAD_COMMUNITYDETAIL_TAGS_SUCCESS passing the variables
 */
export function loadCommunityDetailTagsSuccess(communityPopularTags) {
  return {
    type: LOAD_COMMUNITYDETAIL_TAGS_SUCCESS,
    communityPopularTags,
  };
}

/**
 * Dispatched when loading the loadCommunityDetailTags fails
 *
 * @param  {object} error The errorPopularTags
 *
 * @return {object} An action object with a type of LOAD_COMMUNITYDETAIL_TAGS_ERROR passing the error
 */
export function loadCommunityDetailTagsError(errorPopularTags) {
  return {
    type: LOAD_COMMUNITYDETAIL_TAGS_ERROR,
    errorPopularTags,
  };
}

/**
 * ------------------ UPLOAD MEDIA ------------------
 */

/**
 * Change/Update the communityMedia, this action starts the request saga
 *
 * @return {array} An action object with a type of UPLOAD_MEDIA
 */
export function uploadCommunityMedia(media) {
  return {
    type: UPLOAD_MEDIA,
    media,
  };
}

/**
 * Dispatched when the uploadCommunityMedia are changed/updated by the request saga
 *
 * @param  {array} variable true for communityMedia
 *
 * @return {array} An action object with a type of UPLOAD_MEDIA_SUCCESS passing the variables
 */
export function uploadCommunityMediaSuccess(uploadMedia) {
  return {
    type: UPLOAD_MEDIA_SUCCESS,
    uploadMedia,
  };
}

/**
 * Dispatched when loading the uploadCommunityMedia fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of UPLOAD_MEDIA_ERROR passing the error
 */
export function uploadCommunityMediaError(error) {
  return {
    type: UPLOAD_MEDIA_ERROR,
    error,
  };
}

/**
 * ------------------ LOAD FEEDS ------------------
 */

export function loadCommunityFeed(id, page, filter, entity = 'post') {
  return {
    type: LOAD_FEEDS,
    id,
    page,
    filter,
    entity,
  };
}
export function loadCommunityFeedSuccess(communityFeeds, page, total) {
  return {
    type: LOAD_FEEDS_SUCCESS,
    communityFeeds,
    page,
    total,
  };
}
export function loadCommunityFeedError(errorFeeds) {
  return {
    type: LOAD_FEEDS_ERROR,
    errorFeeds,
  };
}

/**
 * ------------------ POST NEW PUBLICATION ------------------
 */

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

export function postPublicationError(errorPublication) {
  return {
    type: POST_PUBLICATION_ERROR,
    errorPublication,
  };
}

/**
 * ------------------ LOAD ALL TAGS ------------------
 */

export function loadCommunityTags(id) {
  return {
    type: LOAD_TAGS,
    id,
  };
}
export function loadCommunityTagsSuccess(communityTags) {
  return {
    type: LOAD_TAGS_SUCCESS,
    communityTags,
  };
}
export function loadCommunityTagsError(errorTags) {
  return {
    type: LOAD_TAGS_ERROR,
    errorTags,
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
    _id,
  };
}
