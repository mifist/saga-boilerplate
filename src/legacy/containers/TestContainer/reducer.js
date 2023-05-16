/*
 *
 * TestContainer reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  // variables: false,
};

/* eslint-disable default-case, no-param-reassign */
const testContainerReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.DEFAULT_ACTION:
        break;
    }
  });

export default testContainerReducer;
