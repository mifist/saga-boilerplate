import produce from 'immer';
import * as CONSTANS from './constants';

export const initialState = {
  loading: false,
  error: false,
  userAuth: false,
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE:
        return initialState;
      case CONSTANS.LOGIN:
        draft.loading = true;
        draft.error = false;
        break;
      case CONSTANS.LOGIN_SUCCESS:
        draft.userAuth = action.user;
        draft.loading = false;
        break;
      case CONSTANS.LOGIN_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default loginReducer;
