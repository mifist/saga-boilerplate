import produce from 'immer';
import {
  FLUSH_STATE,
  LOAD_CASE,
  LOAD_CASE_ERROR,
  LOAD_CASE_SUCCESS,
  UPDATE_CASE,
  UPDATE_CASE_ERROR,
  UPDATE_CASE_SUCCESS,
  ON_DELETE_SUCCESS,
  PIN_UNPIN_POST,
  PIN_UNPIN_POST_ERROR,
  PIN_UNPIN_POST_SUCCESS,
  HIDE_UNHIDE_POST,
  HIDE_UNHIDE_POST_ERROR,
  HIDE_UNHIDE_POST_SUCCESS,
  LOAD_COMMUNITY_TAGS,
  LOAD_COMMUNITY_TAGS_SUCCESS,
  LOAD_COMMUNITY_TAGS_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  caseData: false,
  deleteSuccessful: false,
  communityTags: false,
  loadingTags: false,
  errorTags: false,
};

/* eslint-disable default-case, no-param-reassign */
const caseDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;

      case ON_DELETE_SUCCESS:
        draft.deleteSuccessful = true;
        break;

      // Load Case
      case LOAD_CASE:
        draft.loading = true;
        draft.error = false;
        break;

      case LOAD_CASE_SUCCESS:
        draft.loading = false;
        draft.caseData = action.caseData;
        draft.error = false;
        break;

      case LOAD_CASE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case UPDATE_CASE:
        if (action.actionType === 'update') {
          draft.loading = true;
        }
        draft.error = false;
        break;

      case UPDATE_CASE_SUCCESS:
        draft.caseData.data = action.caseData;
        draft.loading = false;
        break;

      case UPDATE_CASE_ERROR:
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
        draft.caseData.data.pinned = action.pinned;
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
        draft.caseData.data.hidden = action.hidden;
        break;

      case HIDE_UNHIDE_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case LOAD_COMMUNITY_TAGS:
        draft.loadingTags = true;
        draft.errorTags = false;
        break;

      case LOAD_COMMUNITY_TAGS_SUCCESS:
        draft.communityTags = action.communityTags;
        draft.loadingTags = false;
        break;

      case LOAD_COMMUNITY_TAGS_ERROR:
        draft.errorTags = action.errorTags;
        draft.loadingTags = false;
        break;
    }
  });

export default caseDetailReducer;
