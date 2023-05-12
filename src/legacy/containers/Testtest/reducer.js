/*
 *
 * Testtest reducer
 *
 */
import produce from 'immer';
import {
  FLUSH_STATE_TESTTEST,
  LOAD_TESTTEST,
  LOAD_TESTTEST_SUCCESS,
  LOAD_TESTTEST_ERROR,
  CHANGE_TESTTEST,
  CHANGE_TESTTEST_SUCCESS,
  CHANGE_TESTTEST_ERROR,
  DELETE_TESTTEST,
  DELETE_TESTTEST_SUCCESS,
  DELETE_TESTTEST_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  variables: false,
  deleteSuccessful: false,
  testtestData: false,
};

/* eslint-disable default-case, no-param-reassign */
const testtestReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE_TESTTEST:
        return initialState;

      // LOAD
      case LOAD_TESTTEST:
        draft.loading = true;
        draft.error = false;
        break;

      case LOAD_TESTTEST_SUCCESS:
        draft.testtestData = action.testtestData;
        draft.loading = false;
        break;

      case LOAD_TESTTEST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // CHANGE/UPDATE
      case CHANGE_TESTTEST:
        draft.testtestData = { ...state.testtestData, ...action.testtestData };
        draft.loading = true;
        draft.error = false;
        break;

      case CHANGE_TESTTEST_SUCCESS:
        draft.testtestData = action.testtestData;
        draft.loading = false;
        break;

      case CHANGE_TESTTEST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // DELETE
      case DELETE_TESTTEST:
        draft.loading = true;
        break;

      case DELETE_TESTTEST_SUCCESS:
        draft.loading = false;
        draft.deleteSuccessful = true;
        break;
    }
  });

export default testtestReducer;
