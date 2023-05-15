/*
 *
 * SearchBar reducer
 *
 */
import produce from 'immer';
import * as CONSTANS from './constants';

export const initialState = {
  // loading: false,
  // error: false,
  // variables: false,
};

/* eslint-disable default-case, no-param-reassign */
const searchBarReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case CONSTANS.DEFAULT_ACTION:
        break;
    }
  });

export default searchBarReducer;
