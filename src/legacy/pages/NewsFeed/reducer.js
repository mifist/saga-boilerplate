/*
 *
 * NewsFeed reducer
 *
 */
import produce from 'immer';
import * as CONSTANS from './constants';

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
      case CONSTANS.DEFAULT_ACTION:
        break;
      case CONSTANS.FLUSH:
        return initialState;

      case CONSTANS.SET_NO_MORE:
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

      case CONSTANS.UPLOAD_IMAGES_SUCCESS:
        draft.uploadImages = action.uploadImages;
        break;

      case CONSTANS.SET_DELETED_POSTS:
        draft.deletedPosts = [
          ...new Set([...draft.deletedPosts, ...action.deletedPosts]),
        ];
        break;

      case CONSTANS.POST_PUBLICATION:
        draft.publication = action.publication;
        draft.loadingNewPost = true;
        break;

      case CONSTANS.POST_PUBLICATION_SUCCESS:
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

      case CONSTANS.LOAD_EVENTS:
        draft.loadingEvents = true;
        draft.errorEvents = false;
        break;

      case CONSTANS.UPDATE_LIKES:
        const { publication } = action;
        const index = state.posts.findIndex(po => po?._id === publication?._id);
        if (index !== -1) draft.posts[index].likes = publication.likes;
        break;

      case CONSTANS.LOAD_EVENTS_SUCCESS:
        draft.events.push(...action.events);
        draft.loadingEvents = false;
        break;

      case CONSTANS.LOAD_EVENTS_ERROR:
        draft.errorEvents = action.error;
        draft.loadingEvents = false;
        break;

      case CONSTANS.LOAD_POSTS:
        draft.loadingPosts = true;
        draft.errorPosts = false;
        break;

      case CONSTANS.LOAD_POSTS_SUCCESS:
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

      case CONSTANS.LOAD_POSTS_ERROR:
        draft.errorEvents = action.error;
        draft.loadingPosts = false;
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

export default NewsFeedPageReducer;
