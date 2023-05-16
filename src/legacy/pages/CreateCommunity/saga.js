import { put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'redux-first-history';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

export function* createCommunity(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const createCommunity = yield requestWrapper(
      'POST',
      'communities/new',
      action.values,
      currentUser.token,
    );

    if (createCommunity) {
      yield put(ACTIONS.createCommunitySuccess(true));
      yield put(push(`/community`));
    } else {
      yield put(ACTIONS.createCommunityError(true));
    }
  } catch (err) {
    yield put(ACTIONS.createCommunityError(true));
  }
}

export default function* createCommunitySaga() {
  yield takeLatest(CONSTANTS.CREATE_COMMUNITY, createCommunity);
}
