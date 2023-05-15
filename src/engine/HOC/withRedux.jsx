import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const withRedux = (WrappedComponent) => {
  return function ReduxWrapper(props) {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    return <WrappedComponent {...props} state={state} dispatch={dispatch} />;
  };
};

export default withRedux;