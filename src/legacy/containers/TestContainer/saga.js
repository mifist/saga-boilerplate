// import { call, put, select, takeLatest } from 'redux-saga/effects';
// import { LOAD_VARIABLES } from './constants';
// import {
//   loadVariablesSuccess,
//   loadVariablesError
// } from './actions';

// import requestUtil from 'utils/request';
// import requestWrapper from 'utils/requestWrapper';

// export function* loadVariables() {
//   try{
//     // we retrieve the token from the local storage
//     const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
//     // we get the campaigns linked to the user
//     const variables = yield requestWrapper('GET', 'objects/', "", token);
//     if(properties.length === 0){
//       yield put(loadVariablesSuccess(false));
//     } else {
//       yield put(loadVariablesSuccess(variables));
//     }
//   } catch (err) {
//     yield put(loadVariablesError(false));
//   }
// }

// Individual exports for testing
export default function* testContainerSaga() {
  // See example in legacy/containers/HomePage/saga.js
  // yield takeLatest(LOAD_VARIABLES, loadVariables);
}
