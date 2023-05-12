/**
 *
 * Testtest
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// styles
import './style.scss';

import { useParams } from 'react-router-dom';

import { flushState, onLoadList } from 'pages/SagaContainer/actions';

function Testtest() {
  // const { id: initId } = Params();

  const { list, loading } = useSelector((state) => state.Testtest);

  const dispatch = useDispatch();

  console.log(list);

  // Because history not trigger update component
  useEffect(() => {
    // if (!initId) {
    dispatch(onLoadList(1));
    // }
  }, []);

  // Clearing the state after unmounting a component
  useEffect(() => {
    return () => {
      // Anything in here is fired on component unmount.
      dispatch(flushState());
    };
  }, []);

  // render function
  return (
    <div>
      <h1>test</h1>
    </div>
  );
}

// const mapStateToProps = createStructuredSelector({
//   loading: selectTesttestLoading(),
//   error: selectTesttestError(),
//   deleteSuccessful: selectTesttestDeleteSuccessful(),
//   testtestData: selectTesttestData(),
// });

export default memo(Testtest);
