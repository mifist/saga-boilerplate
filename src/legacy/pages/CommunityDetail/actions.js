/*
 *
 * CommunityDetail actions
 *
 */

import * as CONSTANTS from './constants';

/**
 * Clearing the state for CommunityDetail
 */
export function flushStateCommunityDetail() {
  return {
    type: CONSTANTS.FLUSH_STATE_COMMUNITYDETAIL,
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
    type: CONSTANTS.LOAD_COMMUNITYDETAIL,
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
    type: CONSTANTS.LOAD_COMMUNITYDETAIL_SUCCESS,
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
    type: CONSTANTS.LOAD_COMMUNITYDETAIL_ERROR,
    error,
  };
}

/**
 * ------------------ CHANGE ------------------
 */

export function updateLikesCommunity(publication) {
  return {
    type: CONSTANTS.UPDATE_LIKES,
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
    type: CONSTANTS.CHANGE_COMMUNITYDETAIL,
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
    type: CONSTANTS.CHANGE_COMMUNITYDETAIL_SUCCESS,
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
    type: CONSTANTS.CHANGE_COMMUNITYDETAIL_ERROR,
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
    type: CONSTANTS.DELETE_COMMUNITYDETAIL,
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
    type: CONSTANTS.DELETE_COMMUNITYDETAIL_SUCCESS,
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
    type: CONSTANTS.DELETE_COMMUNITYDETAIL_ERROR,
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
    type: CONSTANTS.LOAD_COMMUNITYDETAIL_TAGS,
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
    type: CONSTANTS.LOAD_COMMUNITYDETAIL_TAGS_SUCCESS,
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
    type: CONSTANTS.LOAD_COMMUNITYDETAIL_TAGS_ERROR,
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
    type: CONSTANTS.UPLOAD_MEDIA,
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
    type: CONSTANTS.UPLOAD_MEDIA_SUCCESS,
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
    type: CONSTANTS.UPLOAD_MEDIA_ERROR,
    error,
  };
}

/**
 * ------------------ LOAD FEEDS ------------------
 */

export function loadCommunityFeed(id, page, filter, entity = 'post') {
  return {
    type: CONSTANTS.LOAD_FEEDS,
    id,
    page,
    filter,
    entity,
  };
}
export function loadCommunityFeedSuccess(communityFeeds, page, total) {
  return {
    type: CONSTANTS.LOAD_FEEDS_SUCCESS,
    communityFeeds,
    page,
    total,
  };
}
export function loadCommunityFeedError(errorFeeds) {
  return {
    type: CONSTANTS.LOAD_FEEDS_ERROR,
    errorFeeds,
  };
}

/**
 * ------------------ POST NEW PUBLICATION ------------------
 */

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

export function postPublicationError(errorPublication) {
  return {
    type: CONSTANTS.POST_PUBLICATION_ERROR,
    errorPublication,
  };
}

/**
 * ------------------ LOAD ALL TAGS ------------------
 */

export function loadCommunityTags(id) {
  return {
    type: CONSTANTS.LOAD_TAGS,
    id,
  };
}
export function loadCommunityTagsSuccess(communityTags) {
  return {
    type: CONSTANTS.LOAD_TAGS_SUCCESS,
    communityTags,
  };
}
export function loadCommunityTagsError(errorTags) {
  return {
    type: CONSTANTS.LOAD_TAGS_ERROR,
    errorTags,
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
