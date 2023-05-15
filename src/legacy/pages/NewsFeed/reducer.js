/*
 *
 * NewsFeed reducer
 *
 */
import produce from 'immer';
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
  POST_PUBLICATION_SUCCESS,
  SET_NO_MORE,
  UPDATE_LIKES,
  UPLOAD_IMAGES_SUCCESS,
  SET_DELETED_POSTS,
  REPORT_POST,
  REPORT_POST_ERROR,
  REPORT_POST_SUCCESS,
  SET_REPORT_POPOP,
} from './constants';

export const initialState = {
  loadingPosts: false,
  loadingEvents: false,
  loadingNewPost: false,
  errorPosts: false,
  errorEvents: false,
  posts: [],
  events: [],
  deletedPosts: [],
  uploadImages: null,
  noMoreEvent: false,
  noMorePost: false,
  noMore: false,
  page: 1,
  reportPopup: {
    opened: false,
    _id: null,
  },
  loadingReport: false,
};

/* eslint-disable default-case, no-param-reassign */
const NewsFeedPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case FLUSH:
        return initialState;

      case SET_NO_MORE:
        const { entity } = action;
        if (entity === 'event') {
          draft.noMoreEvent = true;
        }

        if (entity === 'post') {
          draft.noMorePost = true;
        }

        // IF both are
        if (draft.noMoreEvent && draft.noMorePost) {
          draft.noMore = true;
        }

        break;

      case UPLOAD_IMAGES_SUCCESS:
        draft.uploadImages = action.uploadImages;
        break;

      case SET_DELETED_POSTS:
        draft.deletedPosts = [
          ...new Set([...draft.deletedPosts, ...action.deletedPosts]),
        ];
        break;

      case POST_PUBLICATION:
        draft.publication = action.publication;
        draft.loadingNewPost = true;
        break;

      case POST_PUBLICATION_SUCCESS:
        if (state.posts && action.publication) {
          let i = state.posts.findIndex(
            po => po?._id === action.publication?._id,
          );
          if (i !== -1) {
            draft.posts[i] = action.publication;
          } else {
            // add of the begining
            draft.posts.unshift(action.publication);
          }
        }
        draft.loadingNewPost = false;
        break;

      case LOAD_EVENTS:
        draft.loadingEvents = true;
        draft.errorEvents = false;
        break;

      case UPDATE_LIKES:
        const { publication } = action;
        const index = state.posts.findIndex(po => po?._id === publication?._id);
        if (index !== -1) draft.posts[index].likes = publication.likes;
        break;

      case LOAD_EVENTS_SUCCESS:
        draft.events.push(...action.events);
        draft.loadingEvents = false;
        break;

      case LOAD_EVENTS_ERROR:
        draft.errorEvents = action.error;
        draft.loadingEvents = false;
        break;

      case LOAD_POSTS:
        draft.loadingPosts = true;
        draft.errorPosts = false;
        break;

      case LOAD_POSTS_SUCCESS:
        if (
          (action.page == '1' && state.posts && state.posts.length <= 0) ||
          action.page > '1'
        ) {
          draft.posts.push(...action.posts);
        }
        // draft.posts.push(...action.posts);
        draft.page = action.page;
        draft.loadingPosts = false;
        break;

      case LOAD_POSTS_ERROR:
        draft.errorEvents = action.error;
        draft.loadingPosts = false;
        break;

      case REPORT_POST:
        draft.loadingReport = true;
        break;
      case REPORT_POST_SUCCESS:
        draft.loadingReport = false;
        draft.reportPopup.opened = false;
        draft.reportPopup._id = null;
        break;
      case REPORT_POST_ERROR:
        draft.error = action.error;
        draft.loadingReport = false;
        break;

      case SET_REPORT_POPOP:
        draft.reportPopup.opened = action.opened;
        draft.reportPopup._id = action._id;
        break;
    }
  });

export default NewsFeedPageReducer;
