import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  cases: false,
};

/* eslint-disable default-case, no-param-reassign */
const caseOverviewReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      // Load cases by Filter
      case CONSTANTS.LOAD_CASES:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_CASES_SUCCESS:
        draft.cases = action.cases;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_CASES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.CREATE_CASE:
        draft.loading = false;
        draft.error = false;
        break;

      case CONSTANTS.CREATE_CASE_SUCCESS:
        draft.loading = false;

        const { caseDetail } = action;

        if (state.cases && action.caseDetail) {
          let i = state.cases.data.findIndex((po) => po._id === caseDetail._id);

          if (i !== -1) {
            draft.cases.data[i] = caseDetail;
          } else {
            draft.cases.data.unshift(caseDetail);
          }
        }

        break;

      case CONSTANTS.CREATE_CASE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.UPDATE_LIKES:
        const { publication } = action;

        const index = state.cases.data.findIndex(
          (po) => po?._id === publication?._id,
        );
        if (index !== -1) draft.cases.data[index].likes = publication.likes;
        break;
    }
  });

export default caseOverviewReducer;
