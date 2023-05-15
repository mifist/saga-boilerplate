/*
 *
 * TestContainer reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, FLUSH_STATE } from './constants';

export const initialState = {
  loading: false,
  error: false,
  // variables: false,
};

/* eslint-disable default-case, no-param-reassign */
const testContainerReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;

      case DEFAULT_ACTION:
        break;

      /**
      case LOAD_VARIABLES:
        draft.loading = true;
        draft.error = false;
        draft.properties = false;
        break;

      case LOAD_VARIABLES_SUCCESS:
        draft.properties = action.properties;
        draft.loading = false;
        break;

      case LOAD_VARIABLES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CHANGE_DATA:
        draft.data = action.data;
        break;
         */
    }
  });

export default testContainerReducer;
