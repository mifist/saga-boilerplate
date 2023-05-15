import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import moment from 'moment';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';


export function* loadEvents(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    let dataTab = false;

    const eventsUser = yield requestWrapper(
      'GET',
      'users/paid-events',
      null,
      currentUser.token,
    );

    dataTab = eventsUser;
    if (dataTab.length > 0) {
      dataTab.sort(function(a, b) {
        return moment(b.econgress.date_from) - moment(a.econgress.date_from);
      });
    }

    if (dataTab) {
      yield put(ACTIONS.loadEventsSuccess(dataTab));
    } else {
      yield put(ACTIONS.loadEventsSuccess(false));
    }
  } catch (err) {
    yield put(ACTIONS.loadEventsError(err));
  }
}

export function* loadProfile(action) {
  try {
    // we retrieve the token from the local storage
    // var token = '';
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id } = action;

    // if (id !== currentUser._id) {
    //   const visitResult = yield requestWrapper(
    //     'POST',
    //     `users/visits`,
    //     {
    //       _id: id,
    //       visits: currentUser._id,
    //     },
    //     token,
    //   );
    // }
    // we get the campaigns linked to the user
    const profileDatas = yield requestWrapper(
      'GET',
      `users/profile/${id}`,
      '',
      currentUser.token,
    );

    //console.log(profileDatas);

    if (profileDatas?.user?._id) {
      yield put(ACTIONS.loadProfileSuccess(profileDatas));
    } else {
      yield put(ACTIONS.loadProfileSuccess(false));
    }
  } catch (err) {
    yield put(ACTIONS.loadProfileError(err));
  }
}

export default function* personalProfilePageSaga() {
  yield takeLatest(CONSTANS.LOAD_PROFILE, loadProfile);
  yield takeLatest(CONSTANS.LOAD_EVENTS, loadEvents);
}
