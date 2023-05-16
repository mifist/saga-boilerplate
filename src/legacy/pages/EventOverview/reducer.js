/*
 *
 * EventOverview reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loadingUpcoming: false,
  errorUpcoming: false,
  eventsUpcoming: null,
  currentPageUpcoming: 1,
  dateRangeUpcoming: null,
  accreditedUpcoming: false,

  loadingReplay: false,
  errorReplay: false,
  eventsReplay: null,
  currentPageReplay: 1,
  dateRangeReplay: null,
  accreditedReplay: false,

  specialityField: false,
  anatomyField: false,
};

/* eslint-disable default-case, no-param-reassign */
const eventOverviewReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.LOAD_UPCOMING:
        draft.loadingUpcoming = true;
        draft.errorUpcoming = initialState.errorUpcoming;
        draft.eventsUpcoming = initialState.eventsUpcoming;
        draft.currentPageUpcoming = action.params.currentPageUpcoming;
        draft.dateRangeUpcoming = action.params.dateRangeUpcoming;
        draft.accreditedUpcoming = action.params.accreditedUpcoming;
        draft.specialityField = action.params.specialityField;
        draft.anatomyField = action.params.anatomyField;
        break;

      case CONSTANTS.LOAD_UPCOMING_SUCCESS:
        draft.eventsUpcoming = action.eventsUpcoming;
        draft.loadingUpcoming = false;
        break;

      case CONSTANTS.LOAD_UPCOMING_ERROR:
        draft.errorUpcoming = action.errorUpcoming;
        draft.loadingUpcoming = false;
        break;

      case CONSTANTS.LOAD_REPLAY:
        draft.loadingReplay = true;
        draft.errorReplay = initialState.errorReplay;
        draft.eventsReplay = initialState.eventsReplay;
        draft.currentPageReplay = action.params.currentPageReplay;
        draft.dateRangeReplay = action.params.dateRangeReplay;
        draft.accreditedReplay = action.params.accreditedReplay;
        draft.specialityField = action.params.specialityField;
        draft.anatomyField = action.params.anatomyField;
        break;

      case CONSTANTS.LOAD_REPLAY_SUCCESS:
        draft.eventsReplay = action.eventsReplay;
        draft.loadingReplay = false;
        break;

      case CONSTANTS.LOAD_REPLAY_ERROR:
        draft.errorReplay = action.errorReplay;
        draft.loadingReplay = false;
        break;
    }
  });

export default eventOverviewReducer;
