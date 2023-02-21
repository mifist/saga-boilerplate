/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import * as allConst from './constants';


// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case allConst.FLUSH_STATE:
      return initialState;
    default:
      return state;
  }
};

export default produce(appReducer);