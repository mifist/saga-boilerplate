/*
 *
 * CommunityDetail reducer
 *
 */
import produce from 'immer';
import * as CONSTANS from './constants';

export const initialState = {
  loading: false,
  loadingChange: false,
  error: false,
  id: false,
  deleteSuccessful: false,
  communityDetailData: false,
  // all tags
  communityTags: false,
  loadingTags: false,
  errorTags: false,
  // popular tags
  communityPopularTags: false,
  loadingPopularTags: false,
  errorPopularTags: false,
  // media
  uploadMedia: null,
  loadingMedia: false,
  errorMedia: false,
  // feed
  communityFeeds: [],
  loadingFeeds: false,
  errorFeeds: false,
  // publication
  publication: false,
  loadingPublication: false,
  errorPublication: false,
  // other
  entity: 'post',
  filter: false,
  page: 1,
  limit: 4,
  total: 0,
  noMore: false,
  feedPublication: false,
  errorLikes: false,
  reportPopup: {
    opened: false,
    _id: null,
  },
  loadingReport: false,
};

/* eslint-disable default-case, no-param-reassign */
const communityDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE_COMMUNITYDETAIL:
        return initialState;

      // LOAD
      case CONSTANS.LOAD_COMMUNITYDETAIL:
        draft.id = action.id;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.LOAD_COMMUNITYDETAIL_SUCCESS:
        draft.communityDetailData = action.communityDetailData;
        draft.loading = false;
        break;

      case CONSTANS.LOAD_COMMUNITYDETAIL_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // CHANGE/UPDATE
      case CONSTANS.CHANGE_COMMUNITYDETAIL:
        draft.communityDetailData = {
          ...state.communityDetailData,
          ...action.communityDetailData,
        };
        draft.loadingChange = true;
        draft.error = false;
        break;

      case CONSTANS.CHANGE_COMMUNITYDETAIL_SUCCESS:
        draft.loadingChange = false;
        draft.communityDetailData = {
          ...state.communityDetailData,
          ...action.communityDetailData,
        };
        break;

      case CONSTANS.CHANGE_COMMUNITYDETAIL_ERROR:
        draft.error = action.error;
        draft.loadingChange = false;
        break;

      // DELETE
      case CONSTANS.DELETE_COMMUNITYDETAIL:
        draft.loading = true;
        draft.id = action.id;
        break;

      case CONSTANS.DELETE_COMMUNITYDETAIL_SUCCESS:
        draft.loading = false;
        draft.deleteSuccessful = true;
        break;

      // LOAD ALL TAGS
      case CONSTANS.LOAD_TAGS:
        draft.id = action.id;
        draft.loadingTags = true;
        draft.errorTags = false;
        break;

      case CONSTANS.LOAD_TAGS_SUCCESS:
        draft.communityTags = action.communityTags;
        draft.loadingTags = false;
        break;

      case CONSTANS.LOAD_TAGS_ERROR:
        draft.errorTags = action.errorTags;
        draft.loadingTags = false;
        break;

      // LOAD POPULAR TAGS
      case CONSTANS.LOAD_COMMUNITYDETAIL_TAGS:
        draft.id = action.id;
        draft.loadingPopularTags = true;
        draft.errorPopularTags = false;
        break;

      case CONSTANS.LOAD_COMMUNITYDETAIL_TAGS_SUCCESS:
        draft.communityPopularTags = action.communityPopularTags;
        draft.loadingPopularTags = false;
        break;

      case CONSTANS.LOAD_COMMUNITYDETAIL_TAGS_ERROR:
        draft.errorPopularTags = action.errorPopularTags;
        draft.loadingPopularTags = false;
        break;

      // UPLOAD MEDIA
      case CONSTANS.UPLOAD_MEDIA:
        draft.media = action.media;
        draft.loadingMedia = true;
        draft.errorMedia = false;
        break;

      case CONSTANS.UPLOAD_MEDIA_SUCCESS:
        draft.uploadMedia = action.uploadMedia;
        draft.loadingMedia = false;
        draft.errorMedia = false;
        break;

      case CONSTANS.UPLOAD_MEDIA_ERROR:
        draft.errorMedia = action.errorMedia;
        draft.loadingMedia = false;
        break;

      // POST NEW PUBLICATION
      case CONSTANS.POST_PUBLICATION:
        draft.publication = action.publication;
        draft.loadingPublication = true;
        draft.errorPublication = false;
        break;

      case CONSTANS.POST_PUBLICATION_SUCCESS:
        draft.loadingPublication = false;
        draft.errorPublication = false;
        const { publication } = action;

        if (state.communityFeeds && action.publication) {
          let i = state.communityFeeds.findIndex(
            po => po._id === publication._id,
          );

          if (i !== -1) {
            draft.communityFeeds[i] = publication;
          } else {
            draft.communityFeeds.unshift(publication);
          }
        }

        /*  // add of the begining
        draft.communityFeeds.unshift(publication); */

        break;

      case CONSTANS.POST_PUBLICATION_ERROR:
        draft.errorPublication = action.errorPublication;
        draft.loadingPublication = false;
        break;

      // LOAD FEEDS
      case CONSTANS.LOAD_FEEDS:
        draft.id = action.id;
        draft.page = action.page;
        draft.entity = action.entity;
        draft.loadingFeeds = true;
        draft.errorFeeds = false;

        if (action.page == 1 || action.page == undefined) {
          draft.communityFeeds = [];
          draft.total = 0;
          draft.page = 1;
          draft.noMore = false;
          draft.filter = false;
        } else {
          draft.filter = action.filter;
        }

        break;

      case CONSTANS.LOAD_FEEDS_SUCCESS:
        draft.total = action.total;
        draft.page = action.page;
        draft.loadingFeeds = false;
        draft.communityFeeds.push(...action.communityFeeds);

        if (
          action.total == null ||
          action.total == undefined ||
          (action.communityFeeds && action.communityFeeds.length < state.limit)
        ) {
          draft.noMore = true;
        }

        break;

      case CONSTANS.LOAD_FEEDS_ERROR:
        draft.errorFeeds = action.errorFeeds;
        draft.entity = 'post';
        draft.loadingFeeds = false;
        draft.total = 0;
        draft.page = 1;
        draft.noMore = false;
        draft.filter = false;
        break;

      case CONSTANS.UPDATE_LIKES:
        const updatedPubl = action.publication;
        draft.loadingPublication = false;
        draft.errorLikes = false;
        draft.errorPublication = false;

        if (updatedPubl) {
          const index = state.communityFeeds.findIndex(
            po => po._id === updatedPubl._id,
          );
          if (index !== -1)
            draft.communityFeeds[index].likes = updatedPubl.likes;
        }

        break;

      case CONSTANS.REPORT_POST:
        draft.loadingReport = true;
        break;
      case CONSTANS.REPORT_POST_SUCCESS:
        draft.loadingReport = false;
        draft.reportPopup.opened = false;
        draft.reportPopup._id = null;
        break;
      case CONSTANS.REPORT_POST_ERROR:
        draft.error = action.error;
        draft.loadingReport = false;
        break;

      case CONSTANS.SET_REPORT_POPOP:
        draft.reportPopup.opened = action.opened;
        draft.reportPopup._id = action._id;
        break;
    }
  });

export default communityDetailReducer;
