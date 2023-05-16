// import { call, put, select, takeLatest } from 'redux-saga/effects';
//
// import * as CONSTANTS from './constants';
// import * as ACTIONS from './actions';

// import requestUtil from 'utils/request';
// import requestWrapper from 'utils/requestWrapper';

// export function* loadVariables() {
//   try{
//     // we retrieve the token from the local storage
//     const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
//     // we get the campaigns linked to the user
//     const variables = yield requestWrapper('GET', 'objects/', "", token);
//
//     if(properties.length === 0){
//       yield put(ACTIONS.loadVariablesSuccess(false));
//     } else {
//       yield put(ACTIONS.loadVariablesSuccess(variables));
//     }
//   } catch (err) {
//     yield put(ACTIONS.loadVariablesError(false));
//   }
// }

// Individual exports for testing
export default function* searchBarSaga() {
  // See example in containers/HomePage/saga.js
  // yield takeLatest(CONSTANTS.LOAD_VARIABLES, loadVariables);
}
