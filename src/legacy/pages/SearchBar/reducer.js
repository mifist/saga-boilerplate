/*
 *
 * SearchBar reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  // loading: false,
  // error: false,
  // variables: false,
};

/* eslint-disable default-case, no-param-reassign */
const searchBarReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case CONSTANTS.DEFAULT_ACTION:
        break;
    }
  });

export default searchBarReducer;
