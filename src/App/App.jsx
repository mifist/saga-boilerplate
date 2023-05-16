/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React from 'react';
import Helmet from 'react-helmet';

import { Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import { routes } from 'engine/routes';
import { history } from 'store/store.new';

import AppRouter from 'engine/AppRouter';

function App({}) {
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

      <AppRouter />
    </>
  );
}

export default App;
