import { put, select, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import { CHANGE_TESTTEST, LOAD_TESTTEST, DELETE_TESTTEST } from './constants';

import {
  changeTesttestError,
  changeTesttestSuccess,
  loadTesttestError,
  loadTesttestSuccess,
  deleteTesttestSuccess,
  deleteTesttestError,
} from './actions';

import { Button, notification, Divider, Space } from 'antd';

import { selectTesttestDomain, selectTesttestData } from './selectors';

export function* loadTesttest(action) {
  try {
    const token = localStorage.getItem('token');
    const { id } = action;
    const testtestData = yield requestWrapper('GET', `testtest/${id}`);

    if (!id && testtestData.length === 0) {
      yield put(loadTesttestSuccess(false));
    } else {
      yield put(loadTesttestSuccess(testtestData));
    }
  } catch (error) {
    yield put(loadTesttestError(error));
  }
}

export function* deleteTesttest(action) {
  try {
    const token = localStorage.getItem('token');
    const { id } = action;

    const deleteTesttest = yield requestWrapper(
      'PATCH',
      `yourDeletePath`,
      { id },
      token,
    );

    if (deleteTesttest) {
      yield put(deleteTesttestSuccess());
    }
  } catch (error) {
    yield put(deleteTesttestError(error));
  }
}

export function* changeTesttest(action) {
  try {
    const token = localStorage.getItem('token');
    const testtestData = yield select(selectTesttestData());

    let changedTesttest;

    if (testtestData._id === undefined) {
      changedTesttest = yield requestWrapper(
        'POST',
        'testtest/new/',
        testtestData,
      );
      notification.success({ message: 'Created' });
    } else {
      changedTesttest = yield requestWrapper(
        'PATCH',
        'testtest/',
        testtestData,
      );
      notification.success({ message: 'Updated' });
    }

    if (!changedTesttest) {
      yield put(changeTesttestSuccess(false));
    } else {
      yield put(changeTesttestSuccess(changedTesttest));
    }
  } catch (error) {
    yield put(changeTesttestError(error));
  }
}

export default function* testtestSaga() {
  yield takeLatest(LOAD_TESTTEST, loadTesttest);
  yield takeLatest(CHANGE_TESTTEST, changeTesttest);
  yield takeLatest(DELETE_TESTTEST, deleteTesttest);
}
