import { put, takeLatest } from 'redux-saga/effects';
// utils
import requestWrapper from 'utils/requestWrapper';
import { push } from 'redux-first-history';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

export function* loadList(action) {
  try {
    const { count } = action;
    const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

    // we get the campaigns linked to the plans
    const result = yield requestWrapper(
      'GET',
      fakeDataUrl,
      '',
      null,
      null,
      null,
    );

    if (!result) {
      yield put(ACTIONS.onLoadListSuccess([]));
    } else {
      yield put(ACTIONS.onLoadListSuccess(result?.results));
    }
  } catch (error) {
    console.error({ error });
  }
}

export default function* mainSagaContainer() {
  // See example in src/SagaContainer/saga.js
  yield takeLatest(CONSTANS.LOAD_LIST, loadList);
}
