/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet';
// store
import { useInjectSaga, useInjectReducer } from 'store';
import reducer from './reducer';
import saga from './saga';
// actions
import { flushState } from './actions';
//selectors
import {
  makeSelectError,
  makeSelectLoading,
} from './selectors';

// antd component
import { Layout, Button } from 'antd';
const { Content } = Layout;

// pages
import Home from 'pages/Home';

// containers
import SagaContainer from "pages/SagaContainer";

// utils
import useDeviceDetect from 'appHooks/useDeviceDetect';



function App({ history }) {
  useInjectReducer({ key: 'appSaga', reducer });
  useInjectSaga({ key: 'appSaga', saga });

  const { isMobile } = useDeviceDetect();


  return (
    <>

      <Helmet titleTemplate="%s - SagaBoilerplate" defaultTitle="SagaBoilerplate">
        <meta name="description" content="SagaBoilerplate" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SagaBoilerplate"
        />
        <meta
          property="og:description"
          content="SagaBoilerplate"
        />
        <meta property="og:image" content="" />
      </Helmet>

      <Home />
      <SagaContainer />

    </>
  );
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushState()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(App);

