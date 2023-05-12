import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

import mainSagaContainer from '../pages/SagaContainer/saga';
import appReducer from '../pages/SagaContainer/reducer';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware, routerMiddleware];

export const storeNew = configureStore({
  reducer: {
    appSagaContainer: appReducer,
    router: routerReducer,
    // ALL Reducers
    // units: unitsReducer,
    // unit: unitReducer,
    // configuration: configurationReducer,
  },
  middleware,
});

export const history = createReduxHistory(storeNew);

export default function* rootSaga() {
  yield all([mainSagaContainer()]);
}

sagaMiddleware.run(rootSaga);
