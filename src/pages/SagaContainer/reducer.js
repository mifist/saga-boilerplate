/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import * as CONSTANTS from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  count: 3,
  list: [],
};

const reducerSagaContainer = (state = initialState, action = CONSTANTS) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.LOAD_LIST:
        console.log('LOAD_LIST', { draft, state, action });
        draft.count = action.count;
        draft.loading = true;
        break;

      case CONSTANTS.LOAD_LIST_SUCCESS:
        console.log('LOAD_LIST_SUCCESS', { draft, state, action });
        draft.list = action.list;
        draft.loading = false;
        break;

      default:
        return state;
    }
  });

export default reducerSagaContainer;
