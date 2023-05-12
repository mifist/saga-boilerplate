import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the testtest state domain
 */

const selectTesttestDomain = state => state.testtest || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Testtest
 */

const selectTesttestData = () =>
  createSelector(
    selectTesttestDomain,
    substate => substate.testtestData,
  );

const selectTesttestLoading = () =>
  createSelector(
    selectTesttestDomain,
    substate => substate.loading,
  );

const selectTesttestError = () =>
  createSelector(
    selectTesttestDomain,
    substate => substate.error,
  );

const selectTesttestDeleteSuccessful = () =>
  createSelector(
    selectTesttestDomain,
    substate => substate.deleteSuccessful,
  );

export {
  selectTesttestDomain,
  selectTesttestData,
  selectTesttestLoading,
  selectTesttestError,
  selectTesttestDeleteSuccessful,
};
