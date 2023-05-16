import produce from 'immer';
import * as CONSTANTS from './constants';

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
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.ON_DELETE_SUCCESS:
        draft.deleteSuccessful = true;
        break;

      // Load Case
      case CONSTANTS.LOAD_CASE:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_CASE_SUCCESS:
        draft.loading = false;
        draft.caseData = action.caseData;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_CASE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.UPDATE_CASE:
        if (action.actionType === 'update') {
          draft.loading = true;
        }
        draft.error = false;
        break;

      case CONSTANTS.UPDATE_CASE_SUCCESS:
        draft.caseData.data = action.caseData;
        draft.loading = false;
        break;

      case CONSTANTS.UPDATE_CASE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // PIN UNPIN POST
      case CONSTANTS.PIN_UNPIN_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.PIN_UNPIN_POST_SUCCESS:
        draft.loading = false;
        draft.caseData.data.pinned = action.pinned;
        break;

      case CONSTANTS.PIN_UNPIN_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // HIDE UNHIDE POST
      case CONSTANTS.HIDE_UNHIDE_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.HIDE_UNHIDE_POST_SUCCESS:
        draft.loading = false;
        draft.caseData.data.hidden = action.hidden;
        break;

      case CONSTANTS.HIDE_UNHIDE_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_COMMUNITY_TAGS:
        draft.loadingTags = true;
        draft.errorTags = false;
        break;

      case CONSTANTS.LOAD_COMMUNITY_TAGS_SUCCESS:
        draft.communityTags = action.communityTags;
        draft.loadingTags = false;
        break;

      case CONSTANTS.LOAD_COMMUNITY_TAGS_ERROR:
        draft.errorTags = action.errorTags;
        draft.loadingTags = false;
        break;
    }
  });

export default caseDetailReducer;
