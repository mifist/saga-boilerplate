/**
 * root.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// Import all the third party stuff
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { ReduxRouter } from '@lagunovsky/redux-react-router';
import { Provider } from 'react-redux';
import FontFaceObserver from 'fontfaceobserver';

import 'sanitize.css/sanitize.css';

// Global Styles
import 'theme/root.scss';
// ant styles
import 'antd/dist/antd.css';

// Import Other Providers
import AppProviders from 'appContext/AppProviders';
import App from './App';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!public/favicon.ico';
import 'file-loader?name=.htaccess!public/.htaccess'; // eslint-disable-line import/extensions

// root
// import { configureAppStore } from 'store';
import { storeNew, history } from 'store/store.new';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <StrictMode>
    <Provider store={storeNew}>
      <AppProviders>
        <BrowserRouter history={history}></BrowserRouter>
        <App history={history} />
      </AppProviders>
    </Provider>
  </StrictMode>,
);
