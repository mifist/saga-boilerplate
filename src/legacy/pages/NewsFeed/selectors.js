import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the newsFeedList state domain
 */

const selectGlobal = state => Object.assign(state.global, { deletedPosts: [] });

const selectNewsFeedListDomain = state => state.newsFeedList || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by NewsFeedList
 */

const selectNewsFeedPage = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.page,
  );

const selectNewsFeedPosts = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.posts,
  );

const selectNewsFeedEvents = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.events,
  );

const selectNewsFeedEventsLoading = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.loadingEvents,
  );

const selectNewsFeedPostsLoading = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.loadingPosts,
  );

const selectNewsFeedImages = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.uploadImages,
  );

const selectNoMore = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.noMore,
  );

const selectLoadingNewPost = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.loadingNewPost,
  );

const makeSelectDeletedPosts = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.deletedPosts,
  );

const makeSelectReportPopup = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.reportPopup,
  );

const makeSelectReportLoading = () =>
  createSelector(
    selectNewsFeedListDomain,
    substate => substate.loadingReport,
  );

export {
  selectNewsFeedPosts,
  selectNewsFeedEvents,
  selectNewsFeedEventsLoading,
  selectNewsFeedPostsLoading,
  selectNewsFeedImages,
  selectNoMore,
  selectNewsFeedPage,
  selectLoadingNewPost,
  makeSelectReportPopup,
  makeSelectReportLoading,
  makeSelectDeletedPosts,
};
