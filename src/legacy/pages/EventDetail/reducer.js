/*
 *
 * EventDetail reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

import { notification } from 'antd';

export const initialState = {
  event: null,
  eventUrl: null,
  loading: false,
  error: false,
  liveEventPopup: false,
  replayOpen: false,
};

/* eslint-disable default-case, no-param-reassign */
const eventDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.LOAD_EVENT:
        draft.event = null;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_EVENT_SUCCESS:
        draft.event = action.event;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_EVENT_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.REGISTER_EVENT:
        draft.replayOpen = false;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.REGISTER_EVENT_SUCCESS:
        notification.success({ message: action.result });
        draft.replayOpen = true;
        draft.liveEventPopup = false;
        draft.loading = false;
        break;

      case CONSTANTS.REGISTER_EVENT_ERROR:
        notification.error({ message: action.error });
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.WATCH_EVENT:
        draft.eventUrl = null;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.WATCH_EVENT_SUCCESS:
        draft.eventUrl = action.eventUrl;
        draft.liveEventPopup = true;
        draft.loading = false;
        break;

      case CONSTANTS.WATCH_EVENT_ERROR:
        notification.error({ message: 'Error loading the event' });
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.CLOSE_LIVE_EVENT_POPUP:
        draft.liveEventPopup = false;
        draft.eventUrl = null;
        break;
    }
  });

export default eventDetailReducer;
