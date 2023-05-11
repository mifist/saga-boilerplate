import { configureStore, applyMiddleware, getDefaultMiddleware , compose } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createRouterMiddleware, createRouterReducerMapObject, push, ReduxRouter } from '@lagunovsky/redux-react-router';
import createReducer from './reducers';

function configureAppStore(preloadedState = {}, history) {
  let composeEnhancers = compose;
  const reduxSagaMonitorOptions = {};

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});

    // NOTE: Uncomment the code below to restore support for Redux Saga
    // Dev Tools once it supports redux-saga version 1.x.x
    // if (window.__SAGA_MONITOR_EXTENSION__)
    //   reduxSagaMonitorOptions = {
    //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
    //   };
    /* eslint-enable */
  }


  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const routerMiddleware = createRouterMiddleware(history);

 // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware, routerMiddleware];

  const store = configureStore({
    reducer: createReducer(),
    middleware: [
      ...getDefaultMiddleware(),
      ...middlewares,
    ],
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {};
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then((reducerModule) => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(history);
        store.replaceReducer(nextReducers);
      });
    });
  }

  return store;
}

export default configureAppStore;