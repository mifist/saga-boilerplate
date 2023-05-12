/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { createRouterReducer } from '@lagunovsky/redux-react-router';

import history from 'utils/history';
//import languageProviderReducer from 'containers/LanguageProvider/reducer';

/**
 * Merges the main reducer with the dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    // language: languageProviderReducer,
    router: createRouterReducer(history),
    ...injectedReducers
  });

  return rootReducer;
}
