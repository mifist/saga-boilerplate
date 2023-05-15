import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the testContainer state domain
 */

const selectTestContainerDomain = state => state.testContainer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TestContainer
 */

const makeSelectTestContainer = () =>
  createSelector(
    selectTestContainerDomain,
    substate => substate,
  );

export {
  makeSelectTestContainer,
  selectTestContainerDomain
};
