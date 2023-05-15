/*
 *
 * Upvote reducer
 *
 */
import produce from 'immer';
import { FLUSH_STATE } from './constants';

export const initialState = {
  error: false,
  loading: false,
  firstRender: true,
};

/* eslint-disable default-case, no-param-reassign */
const upvoteReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        draft.loading = initialState.loading;
        draft.error = initialState.error;
        draft.firstRender = initialState.firstRender;
        break;


    }
  });

export default upvoteReducer;
