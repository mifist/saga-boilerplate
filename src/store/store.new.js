import { configureStore, t } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

import reducers from './reducers';
import sagas from './sagas';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

const sagaMiddleware = createSagaMiddleware();

// Custom middleware
const middleware = [sagaMiddleware, routerMiddleware];

export const storeNew = configureStore({
  reducer: {
    router: routerReducer,
    ...reducers,
    // ALL Reducers
    // units: unitsReducer,
    // unit: unitReducer,
    // configuration: configurationReducer,
  },
  middleware,
});

export const history = createReduxHistory(storeNew);

export default function* rootSaga() {
  const sagaArray = Object.values(sagas);
  if (sagaArray?.length > 0) {
    yield all(sagaArray.map((saga) => saga()));
  }
}

sagaMiddleware.run(rootSaga);
