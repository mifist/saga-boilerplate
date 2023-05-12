import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import mainSagaContainer from '../pages/SagaContainer/saga';
import appReducer from '../pages/SagaContainer/reducer';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const store = configureStore({
  reducer: {
    appSagaContainer: appReducer,
    // ALL Reducers
    // units: unitsReducer,
    // unit: unitReducer,
    // configuration: configurationReducer,
  },
  middleware,
});

export default function* rootSaga() {
  yield all([mainSagaContainer()]);
}

sagaMiddleware.run(rootSaga);
