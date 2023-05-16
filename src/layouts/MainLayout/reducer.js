/*
 *
 * MainLayout reducer
 *
 */
import produce from 'immer';
import { FLUSH_STATE } from './constants';
import {
  LOAD_FRESH_NOTIFICATIONS,
  LOAD_FRESH_NOTIFICATIONS_ERROR,
  LOAD_FRESH_NOTIFICATIONS_SUCCESS,
  RESET_NOTIFICATIONS,
  RESET_NOTIFICATIONS_ERROR,
  RESET_NOTIFICATIONS_SUCCESS,
} from '../../legacy/pages/Notifications/constants';

export const initialState = {
  loading: false,
  error: false,
  freshNotifications: [],
  resetNotifications: false,
};

/* eslint-disable default-case, no-param-reassign */
const mainLayoutReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;

      case RESET_NOTIFICATIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case RESET_NOTIFICATIONS_SUCCESS:
        draft.resetNotifications = Boolean(action.resetNotifications);
        draft.freshNotifications = [];
        draft.loading = false;
        break;

      case RESET_NOTIFICATIONS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case LOAD_FRESH_NOTIFICATIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case LOAD_FRESH_NOTIFICATIONS_SUCCESS:
        draft.freshNotifications = action.freshNotifications;
        draft.loading = false;
        break;

      case LOAD_FRESH_NOTIFICATIONS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default mainLayoutReducer;
