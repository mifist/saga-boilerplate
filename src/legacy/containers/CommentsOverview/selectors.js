import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the CommentsOverview state domain
 */

const selectCommentsOverviewDomain = state =>
  state.commentsOverview || initialState;

/**
 * Other specific selectors
 */

const makeSelectReportPopupOpened = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.reportPopupOpened,
  );

const makeSelectModifyPostTypePopupOpened = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.modifyPostTypePopupOpened,
  );

const makeSelectLoadingComment = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.loadingComment,
  );

const makeSelectLoadingCommentLike = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.commentLikeLoading,
  );

const makeSelectLoading = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.error,
  );

const makeSelectComments = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.comments,
  );

const makeSelectFirstRender = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate.firstRender,
  );

/**
 * Default selector used by Comments
 */

const makeSelectCommentsOverview = () =>
  createSelector(
    selectCommentsOverviewDomain,
    substate => substate,
  );

export {
  selectCommentsOverviewDomain,
  makeSelectCommentsOverview,
  makeSelectError,
  makeSelectFirstRender,
  makeSelectComments,
  makeSelectLoadingComment,
  makeSelectLoading,
  makeSelectLoadingCommentLike,
  makeSelectReportPopupOpened,
  makeSelectModifyPostTypePopupOpened,
};
