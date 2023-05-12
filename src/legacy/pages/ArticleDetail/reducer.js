import produce from 'immer';
import {
  UPDATE_ARTICLE,
  UPDATE_ARTICLE_ERROR,
  UPDATE_ARTICLE_SUCCESS,
  FLUSH_STATE,
  LOAD_ARTICLE,
  LOAD_ARTICLE_ERROR,
  LOAD_ARTICLE_SUCCESS,
  ON_DELETE_SUCCESS,
  PIN_UNPIN_POST,
  PIN_UNPIN_POST_ERROR,
  PIN_UNPIN_POST_SUCCESS,
  HIDE_UNHIDE_POST,
  HIDE_UNHIDE_POST_ERROR,
  HIDE_UNHIDE_POST_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  article: false,
  deleteSuccessful: false,
};

/* eslint-disable default-case, no-param-reassign */
const articleDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;

      case ON_DELETE_SUCCESS:
        draft.deleteSuccessful = true;
        break;

      // Load Case
      case LOAD_ARTICLE:
        draft.loading = true;
        draft.error = false;
        break;

      case LOAD_ARTICLE_SUCCESS:
        draft.article = action.article;
        draft.loading = false;
        break;

      case LOAD_ARTICLE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // Change
      case UPDATE_ARTICLE:
        if (action.actionType === 'update') {
          draft.loading = true;
        }
        draft.error = false;
        break;

      case UPDATE_ARTICLE_SUCCESS:
        draft.article = action.article;
        draft.loading = false;
        break;

      case UPDATE_ARTICLE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // PIN UNPIN POST
      case PIN_UNPIN_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case PIN_UNPIN_POST_SUCCESS:
        draft.loading = false;
        draft.article.data.pinned = action.pinned;
        break;

      case PIN_UNPIN_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // HIDE UNHIDE POST
      case HIDE_UNHIDE_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case HIDE_UNHIDE_POST_SUCCESS:
        draft.loading = false;
        draft.article.data.hidden = action.hidden;
        break;

      case HIDE_UNHIDE_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default articleDetailReducer;
