import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the register state domain
 */

const selectRegisterDomain = state => state.register || initialState;

/**
 * Other specific selectors
 */

const makeSelectLoading = () =>
  createSelector(
    selectRegisterDomain,
    substate => substate.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectRegisterDomain,
    substate => substate.error,
  );

const makeSelectCountries = () =>
  createSelector(
    selectRegisterDomain,
    substate => substate.countries,
  );

const makeSelectAnatomies = () =>
  createSelector(
    selectRegisterDomain,
    substate => substate.anatomies,
  );

const makeSelectDomains = () =>
  createSelector(
    selectRegisterDomain,
    substate => substate.domains,
  );

const makeSelectRegisterSuccess = () =>
  createSelector(
    selectRegisterDomain,
    substate => substate.registerSuccess,
  );

export {
  selectRegisterDomain,
  makeSelectLoading,
  makeSelectError,
  makeSelectCountries,
  makeSelectAnatomies,
  makeSelectDomains,
  makeSelectRegisterSuccess,
};
