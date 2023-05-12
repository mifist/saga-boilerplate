/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import * as CONSTANS from './constants';


// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  count: 3,
  list: [],
};

const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE:
        return initialState;
      
      case CONSTANS.LOAD_LIST:
        console.log('LOAD_LIST', { draft, state, action });
        draft.count = action.count;
        break;
      
      case CONSTANS.LOAD_LIST_SUCCESS:
        console.log('LOAD_LIST_SUCCESS', { draft, state, action });
        draft.list = action.list;
        break;
      
      default:
        return state;
    }
  });

export default appReducer;