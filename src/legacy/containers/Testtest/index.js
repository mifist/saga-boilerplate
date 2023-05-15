/**
 *
 * Testtest
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import messages from './messages';

// styles
import './style.scss';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

import { useParams } from 'react-router-dom';

import {
  flushStateTesttest,
  loadTesttest,
  changeTesttest,
  deleteTesttest,
} from './actions';

import {
  selectTesttestData,
  selectTesttestLoading,
  selectTesttestError,
  selectTesttestDeleteSuccessful,
} from './selectors';

// antd component
import { Col, Row } from 'antd';

// assets
//import CustomIcons from 'legacy/components/CustomIcons';

// global user
//import { withUser } from 'engine/context/User.context';

export function Testtest({
  // main data
  testtestData,
  // states
  deleteSuccessful,
  error,
  loading,
  // actions
  loadTesttest,
  changeTesttest,
  deleteTesttest,
  flushState,
}) {
  useInjectReducer({ key: 'testtest', reducer });
  useInjectSaga({ key: 'testtest', saga });

  const { id: initId } = useParams();
  const [currentID, setCurrentID] = useState(initId);

  // Because history not trigger update component
  useEffect(() => {
    if (!initId) {
      setCurrentID(initId);
      loadTesttest(initId);
    }
  }, [initId]);

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    // --> main code here
  }, []);

  // Clearing the state after unmounting a component
  useEffect(() => {
    return () => {
      // Anything in here is fired on component unmount.
      flushState();
    };
  }, []);

  // render function
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Testtest.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  deleteSuccessful: PropTypes.bool,
  loadTesttest: PropTypes.func.isRequired,
  changeTesttest: PropTypes.func,
  deleteTesttest: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: selectTesttestLoading(),
  error: selectTesttestError(),
  deleteSuccessful: selectTesttestDeleteSuccessful(),
  testtestData: selectTesttestData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushStateTesttest()),
    loadTesttest: id => dispatch(loadTesttest(id)),
    changeTesttest: data => dispatch(changeTesttest(data)),
    deleteTesttest: id => dispatch(deleteTesttest(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Testtest);
