/**
 * root.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// Import all the third party stuff
import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
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
import { configureAppStore } from 'store';
import history from 'utils/history';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

// Create redux store with history
const initialState = {};
const store = configureAppStore(initialState, history);

// Tell React to take control of that element
// In TypeScript, since there is a bug, you need to add the "!" element!
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43848
const MOUNT_NODE = document.getElementById('app');
const root = ReactDOM.createRoot(MOUNT_NODE);


const render = (Component) =>
  root.render(
    <StrictMode>
      <Provider store={store} >
        <ReduxRouter history={history}>
          <AppProviders>
            <Component history={history} />
          </AppProviders>
        </ReduxRouter>
      </Provider>
    </StrictMode>
  );

render(App);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./App'], () => {
    const NextRootContainer = require('./App/App').default;
//root.unmountComponentAtNode(document.getElementById('app'));
    render(NextRootContainer);
  });
}