import { put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import history from 'utils/history';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

export function* loadMyCommunities(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    if (currentUser) {
      // we get the campaigns linked to the communitiesOverview
      const myCommunities = yield requestWrapper(
        'GET',
        `communities/user/${currentUser?._id}`,
        null,
        currentUser.token,
      );

      if (!myCommunities) {
        yield put(ACTIONS.loadMyCommunitiesSuccess(false));
      } else {
        yield put(ACTIONS.loadMyCommunitiesSuccess(myCommunities));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.loadMyCommunitiesError(error));
  }
}

export function* loadActiveCommunities(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { filter } = action;

    // we get the campaigns linked to the communitiesOverview
    const activeCommunities = yield requestWrapper(
      'POST',
      'communities/filter',
      filter,
      currentUser?.token,
    );

    if (!activeCommunities) {
      yield put(ACTIONS.loadActiveCommunitiesSuccess(false));
    } else {
      yield put(ACTIONS.loadActiveCommunitiesSuccess(activeCommunities));
    }
  } catch (error) {
    yield put(ACTIONS.loadActiveCommunitiesError(error));
  }
}

export default function* communitiesOverviewSaga() {
  yield takeLatest(CONSTANS.LOAD_MY_COMMUNITIES, loadMyCommunities);
  yield takeLatest(CONSTANS.LOAD_ACTIVE_COMMUNITIES, loadActiveCommunities);
}
