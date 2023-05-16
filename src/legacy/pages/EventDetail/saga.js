import { put, call, takeLatest } from 'redux-saga/effects';

import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

import { BEEMED_LEGACY_API_URL } from 'utils/constants';

export function* loadEvents(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    // we get the campaigns linked to the user
    const event = yield requestWrapper(
      'GET',
      `events/${action.id}`,
      null,
      currentUser?.token,
      'events',
    );

    yield put(ACTIONS.loadEventSuccess(event));
  } catch (err) {
    yield put(ACTIONS.loadEventError(err));
  }
}

export function* registerEvent(action) {
  try {
    // we get the campaigns linked to the user
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    let data = {
      eventType: action.eventType,
      id: action.id, // event id
      userId: action.userId,
    };

    const response = yield requestWrapper(
      'POST',
      'users/events/register',
      data,
      currentUser.token,
    );

    if (response.result === 'OK') {
      yield put(ACTIONS.registerEventSuccess(response.message));
    } else {
      yield put(
        ACTIONS.registerEventError('An error occured during registration'),
      );
    }
  } catch (err) {
    yield put(
      ACTIONS.registerEventError('An error occured during registration'),
    );
  }
}

export function* watchEvent(action) {
  try {
    // we get the campaigns linked to the user
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    let data = {
      eventType: action.eventType,
      id: action.id, // event id
      userId: action.userId,
    };
    const url = yield requestWrapper(
      'POST',
      'users/events/url',
      data,
      currentUser.token,
    );

    // console.debug(url);
    if (url) {
      yield put(ACTIONS.watchEventSuccess(url.result));
    } else {
      console.debug('second error');
      yield put(ACTIONS.watchEventError(true));
    }
  } catch (err) {
    console.debug(err);
    yield put(ACTIONS.watchEventError(err));
  }
}

// Individual exports for testing
export default function* eventDetailSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CONSTANTS.LOAD_EVENT, loadEvents);
  yield takeLatest(CONSTANTS.REGISTER_EVENT, registerEvent);
  yield takeLatest(CONSTANTS.WATCH_EVENT, watchEvent);
}
