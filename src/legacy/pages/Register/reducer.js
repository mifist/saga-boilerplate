import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  countries: [],
  anatomies: [],
  domains: [],
  registerSuccess: false,
};

/* eslint-disable default-case, no-param-reassign */
const registerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.REGISTER:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.REGISTER_SUCCESS:
        draft.registerSuccess = true;
        draft.loading = false;
        break;

      case CONSTANTS.REGISTER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.RESEND_VERIFY_EMAIL:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.RESEND_VERIFY_EMAIL_SUCCESS:
        draft.loading = false;
        break;

      case CONSTANTS.RESEND_VERIFY_EMAIL_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // GET COUNTRIES
      case CONSTANTS.GET_DICTIONARIES:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.GET_DICTIONARIES_SUCCESS:
        draft.loading = false;
        draft[action.dictionaryType] = action.data;
        break;

      case CONSTANTS.GET_DICTIONARIES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default registerReducer;
