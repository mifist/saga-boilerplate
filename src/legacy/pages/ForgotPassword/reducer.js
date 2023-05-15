import produce from 'immer';
import * as CONSTANS from './constants';

export const initialState = {
  loading: false,
  error: false,
  success: false,
};

/* eslint-disable default-case, no-param-reassign */
const forgotPasswordReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE:
        return initialState;

      case CONSTANS.FORGOT_PASSWORD:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.FORGOT_PASSWORD_SUCCESS:
        draft.loading = false;
        draft.success = true;
        break;

      case CONSTANS.FORGOT_PASSWORD_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default forgotPasswordReducer;