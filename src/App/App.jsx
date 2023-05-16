/**
 *
 * App
 *
 */
import React from 'react';
import Helmet from 'react-helmet';

import AppRouter from 'engine/AppRouter';

// capacitor
// import { appHelper } from 'appCapacitor/helpers';
// utils
import useDeviceDetect from 'appHooks/useDeviceDetect';

function App({ }) {

  const { isMobile, isMobileBrowser } = useDeviceDetect();
  
  let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  let isApp = false;
  if (isMobile || width < 800) {
    isApp = true;
  }

  return (
    <>
      <Helmet
        titleTemplate="%s - SagaBoilerplate"
        defaultTitle="SagaBoilerplate"
      >
        <meta name="description" content="SagaBoilerplate" />
        <meta property="og:type" content="website" />
        <metap property="og:title" content="SagaBoilerplate" />
        <meta property="og:description" content="SagaBoilerplate" />
        <meta property="og:image" content="" />
      </Helmet>

      <AppRouter isApp={isApp} />
    </>
  );
}

export default App;
