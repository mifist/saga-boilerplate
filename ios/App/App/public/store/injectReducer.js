import React, { useContext, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';

import getInjectors from './reducerInjectors';

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
const withReducer = ({ key, reducer }) => WrappedComponent => {
  function ReducerInjector(props) {
    const context = useContext(ReactReduxContext);

    useEffect(() => {
      getInjectors(context.store).injectReducer(key, reducer);
    }, [context.store]);

    return <WrappedComponent {...props} />;
  }

  ReducerInjector.WrappedComponent = WrappedComponent;
  ReducerInjector.displayName = `withReducer(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  return ReducerInjector;
};

const useInjectReducer = ({ key, reducer }) => {
  const context = useContext(ReactReduxContext);
  useEffect(() => {
    getInjectors(context.store).injectReducer(key, reducer);
  }, [context.store]);
};

export { withReducer, useInjectReducer };