import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the Upvote state domain
 */

const selectUpvoteDomain = state =>
  state.upvote || initialState;

/**
 * Other specific selectors
 */

const makeSelectLoading = () =>
  createSelector(
    selectUpvoteDomain,
    substate => substate.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectUpvoteDomain,
    substate => substate.error,
  );

const makeSelectFirstRender = () =>
  createSelector(
    selectUpvoteDomain,
    substate => substate.firstRender,
  );

/**
 * Default selector used by Comments
 */

const makeSelectUpvote = () =>
  createSelector(
    selectUpvoteDomain,
    substate => substate,
  );

export {
  selectUpvoteDomain,
  makeSelectUpvote,
  makeSelectError,
  makeSelectFirstRender,
  makeSelectLoading,
};
