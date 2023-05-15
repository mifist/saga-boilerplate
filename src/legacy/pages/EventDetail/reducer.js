/*
 *
 * EventDetail reducer
 *
 */
import produce from 'immer';
import * as CONSTANS from './constants';

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
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE:
        return initialState;

      case CONSTANS.LOAD_EVENT:
        draft.event = null;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.LOAD_EVENT_SUCCESS:
        draft.event = action.event;
        draft.loading = false;
        break;

      case CONSTANS.LOAD_EVENT_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANS.REGISTER_EVENT:
        draft.replayOpen = false;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.REGISTER_EVENT_SUCCESS:
        notification.success({ message: action.result });
        draft.replayOpen = true;
        draft.liveEventPopup = false;
        draft.loading = false;
        break;

      case CONSTANS.REGISTER_EVENT_ERROR:
        notification.error({ message: action.error });
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANS.WATCH_EVENT:
        draft.eventUrl = null;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANS.WATCH_EVENT_SUCCESS:
        draft.eventUrl = action.eventUrl;
        draft.liveEventPopup = true;
        draft.loading = false;
        break;

      case CONSTANS.WATCH_EVENT_ERROR:
        notification.error({ message: 'Error loading the event' });
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANS.CLOSE_LIVE_EVENT_POPUP:
        draft.liveEventPopup = false;
        draft.eventUrl = null;
        break;
    }
  });

export default eventDetailReducer;
