import produce from 'immer';
import * as CONSTANS from './constants';

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
      case CONSTANS.FLUSH_STATE:
        return initialState;

      case CONSTANS.ON_DELETE_SUCCESS:
        draft.deleteSuccessful = true;
        break;

      // Load Case
      case CONSTANS.LOAD_CASE:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.LOAD_CASE_SUCCESS:
        draft.loading = false;
        draft.caseData = action.caseData;
        draft.error = false;
        break;

      case CONSTANS.LOAD_CASE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANS.UPDATE_CASE:
        if (action.actionType === 'update') {
          draft.loading = true;
        }
        draft.error = false;
        break;

      case CONSTANS.UPDATE_CASE_SUCCESS:
        draft.caseData.data = action.caseData;
        draft.loading = false;
        break;

      case CONSTANS.UPDATE_CASE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // PIN UNPIN POST
      case CONSTANS.PIN_UNPIN_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.PIN_UNPIN_POST_SUCCESS:
        draft.loading = false;
        draft.caseData.data.pinned = action.pinned;
        break;

      case CONSTANS.PIN_UNPIN_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // HIDE UNHIDE POST
      case CONSTANS.HIDE_UNHIDE_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.HIDE_UNHIDE_POST_SUCCESS:
        draft.loading = false;
        draft.caseData.data.hidden = action.hidden;
        break;

      case CONSTANS.HIDE_UNHIDE_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANS.LOAD_COMMUNITY_TAGS:
        draft.loadingTags = true;
        draft.errorTags = false;
        break;

      case CONSTANS.LOAD_COMMUNITY_TAGS_SUCCESS:
        draft.communityTags = action.communityTags;
        draft.loadingTags = false;
        break;

      case CONSTANS.LOAD_COMMUNITY_TAGS_ERROR:
        draft.errorTags = action.errorTags;
        draft.loadingTags = false;
        break;
    }
  });

export default caseDetailReducer;
