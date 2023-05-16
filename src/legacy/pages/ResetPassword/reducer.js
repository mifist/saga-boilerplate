import produce from 'immer';
import * as CONSTANTS from './constants';
export const initialState = {
  loading: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const resetPasswordReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.RESET_PASSWORD:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.RESET_PASSWORD_SUCCESS:
        draft.loading = false;
        break;

      case CONSTANTS.RESET_PASSWORD_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default resetPasswordReducer;
