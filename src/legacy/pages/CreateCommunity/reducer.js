import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: null,
  communityDetail: null,
};

/* eslint-disable default-case, no-param-reassign */
const createCommunityReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.CREATE_COMMUNITY:
        draft.loading = true;
        draft.error = false;
        break;
      case CONSTANTS.CREATE_COMMUNITY_SUCCESS:
        draft.loading = false;
        draft.communityDetail = action;
        break;
      case CONSTANTS.CREATE_COMMUNITY_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default createCommunityReducer;
