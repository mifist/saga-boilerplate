/*
 *
 * Notifications reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: true,
  error: false,
  notification: {},
  notifications: [],
  noMore: false,
  totalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const NotificationsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH:
        return initialState;

      case CONSTANTS.LOAD_NOTIFICATIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_NOTIFICATIONS_SUCCESS:
        draft.notifications = action.notifications;
        draft.loading = false;
        draft.totalCount = action.totalCount;
        break;

      case CONSTANTS.LOAD_NOTIFICATIONS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.SET_NO_MORE:
        draft.noMore = true;
        break;

      case CONSTANTS.UPDATE_NOTIFICATION:
        draft.notification = action.notification;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.UPDATE_NOTIFICATION_SUCCESS:
        const { notification } = action;
        const index = state.notifications.findIndex(
          (notif) => notif._id === notification._id,
        );
        index !== -1 && (draft.notifications[index] = notification);
        draft.loading = false;
        break;

      case CONSTANTS.UPDATE_NOTIFICATION_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default NotificationsReducer;
