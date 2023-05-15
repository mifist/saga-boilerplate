import produce from 'immer';
import * as CONSTANS from './constants';
export const initialState = {
  loading: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const resetPasswordReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE:
        return initialState;

      case CONSTANS.RESET_PASSWORD:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.RESET_PASSWORD_SUCCESS:
        draft.loading = false;
        break;

      case CONSTANS.RESET_PASSWORD_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default resetPasswordReducer;
