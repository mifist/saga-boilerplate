/*
 *
 * CaseOverview reducer
 *
 */
import produce from 'immer';
import { FLUSH_STATE, LOAD_EVENTS, LOAD_EVENTS_ERROR, LOAD_EVENTS_SUCCESS } from './constants';

export const initialState = {
  loading: false,
  error: false,
  events: false,
  replayEvents: false,
  typeLayout: false,
};

/* eslint-disable default-case, no-param-reassign */
const profileSuggestionsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;
      
      case LOAD_EVENTS:
        draft.loading = true;
        draft.error = false;
        draft.events = false;
        draft.replayEvents = false;
        draft.typeLayout = action.typeLayout;
        break;

      case LOAD_EVENTS_SUCCESS:
        draft.events = action.events;
        draft.replayEvents = action.replayEvents;
        draft.loading = false;
        break;

      case LOAD_EVENTS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default profileSuggestionsReducer;
