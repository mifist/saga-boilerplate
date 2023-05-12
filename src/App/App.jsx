/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
// store
// actions
//selectors

// antd component
import { Layout } from 'antd';
// pages
import Home from 'pages/Home';

// containers
import SagaContainer from 'pages/SagaContainer';

// utils
import useDeviceDetect from 'appHooks/useDeviceDetect';

const { Content } = Layout;


function App({ history }) {

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

export default memo(App);

