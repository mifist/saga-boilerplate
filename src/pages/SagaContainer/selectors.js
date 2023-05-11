import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the state domain
 */

export const selectDomain = state => state.appSagaContainer || initialState;
const selectRouter = state => state?.router;

export const makeSelectLoading = () => 
  createSelector(
    selectDomain,
    substate => substate.loading
  );

export const makeSelectError = () => 
  createSelector(
    selectDomain,
    substate => substate.error
  );

export const makeSelectList = () => 
  createSelector(
    selectDomain,
    substate => substate.list
  );