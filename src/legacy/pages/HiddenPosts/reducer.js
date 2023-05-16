import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  hiddenPosts: null,
  loading: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const hiddenPostsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.LOAD_HIDDEN_POSTS:
        draft.hiddenPosts = null;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_HIDDEN_POSTS_SUCCESS:
        draft.hiddenPosts = action.hiddenPosts;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_HIDDEN_POSTS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // UNHIDE POST
      case CONSTANTS.UNHIDE_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.UNHIDE_POST_SUCCESS:
        draft.loading = false;
        draft.hiddenPosts = draft.hiddenPosts.filter(
          (posts) => posts._id !== action.postId,
        );
        break;

      case CONSTANTS.UNHIDE_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default hiddenPostsReducer;
