import requestWrapper from 'utils/requestWrapper';
import { put, select, takeLatest } from 'redux-saga/effects';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

export function* loadUpcomingEvents(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { state } = action;

    let url = `events/?order=ASC&perPage=${15}&page=${
      state.currentPageUpcoming
    }${
      state.dateRangeUpcoming[0] !== ''
        ? `&date_from=${state.dateRangeUpcoming[0]}&date_to=${
            state.dateRangeUpcoming[1]
          }`
        : ''
    }${state.accreditedUpcoming ? '&accredited=1' : ''}`;

    if (state.specialityField) {
      url = url + '&field_id=' + state.specialityField;
    }

    if (state.anatomyField) {
      url = url + '&anatomy_id=' + state.anatomyField;
    }

    // &field_id=1&anatomy_id=36

    // we get the campaigns linked to the user
    const events = yield requestWrapper(
      'GET',
      url,
      null,
      currentUser?.token,
      'events',
    );

    yield put(ACTIONS.loadUpcomingSuccess(events));
  } catch (err) {
    yield put(ACTIONS.loadUpcomingError(err));
  }
}

export function* loadReplayEvents() {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const state = yield select(makeSelectEventOverview());

    let url = `events/?order=DESC&perPage=${15}&page=${
      state.currentPageReplay
    }${
      state.dateRangeReplay[0] !== ''
        ? `&date_from=${state.dateRangeReplay[0]}&date_to=${
            state.dateRangeReplay[1]
          }`
        : ''
    }${state.accreditedReplay ? '&accredited=1' : ''}`;

    if (state.specialityField) {
      url = url + '&field_id=' + state.specialityField;
    }

    if (state.anatomyField) {
      url = url + '&anatomy_id=' + state.anatomyField;
    }

    // we get the campaigns linked to the user
    const events = yield requestWrapper(
      'GET',
      url,
      null,
      currentUser?.token,
      'events',
    );

    yield put(ACTIONS.loadReplaySuccess(events));
  } catch (err) {
    yield put(ACTIONS.loadReplayError(err));
  }
}

// Individual exports for testing
export default function* eventOverviewSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CONSTANS.LOAD_UPCOMING, loadUpcomingEvents);
  yield takeLatest(CONSTANS.LOAD_REPLAY, loadReplayEvents);
}
