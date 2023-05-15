import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the communityDetail state domain
 */

const selectCommunityDetailDomain = state =>
  state.communityDetail || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CommunityDetail
 */

const selectCommunityDetailData = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.communityDetailData,
  );

const selectCommunityDetailLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loading,
  );

const selectCommunityDetailLoadingChange = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingChange,
  );

const selectCommunityDetailError = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.error,
  );

const selectCommunityDetailDeleteSuccessful = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.deleteSuccessful,
  );

const makeSelectId = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.id,
  );

// All Tags
const selectCommunityTags = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.communityTags,
  );

const selectCommunityTagsLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingTags,
  );

const selectCommunityTagsError = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.errorTags,
  );

// Popular Tags
const selectCommunityDetailTags = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.communityPopularTags,
  );

const selectCommunityDetailTagsLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingPopularTags,
  );

const selectCommunityDetailTagsError = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.errorPopularTags,
  );

// Media
const selectCommunityMedia = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.uploadMedia,
  );

const selectCommunityMediaLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingMedia,
  );

const selectCommunityMediaError = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.errorMedia,
  );

// Other
const selectCommunityPageCases = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.pageCases,
  );

const selectCommunityPage = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.page,
  );

// Feeds
const selectCommunityFeeds = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.communityFeeds,
  );
const selectCommunityFeedsLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingFeeds,
  );
const selectCommunityFeedsError = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.errorFeeds,
  );

const selectCommunityFeedsNoMore = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.noMore,
  );

// Cases
const selectCommunityCases = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.communityCases,
  );
const selectCommunityCasesLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingCases,
  );
const selectCommunityCasesError = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.errorCases,
  );

const selectCommunityCasesNoMore = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.noMoreCases,
  );

const makeSelectReportPopup = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.reportPopup,
  );

const makeSelectReportLoading = () =>
  createSelector(
    selectCommunityDetailDomain,
    substate => substate.loadingReport,
  );

export {
  selectCommunityDetailDomain,
  selectCommunityDetailLoading,
  selectCommunityDetailError,
  selectCommunityDetailDeleteSuccessful,
  selectCommunityDetailData,
  makeSelectId,
  selectCommunityDetailLoadingChange,
  // all tags
  selectCommunityTags,
  selectCommunityTagsLoading,
  selectCommunityTagsError,
  // popular tags
  selectCommunityDetailTags,
  selectCommunityDetailTagsLoading,
  selectCommunityDetailTagsError,
  // media
  selectCommunityMedia,
  selectCommunityMediaLoading,
  selectCommunityMediaError,
  // other
  selectCommunityPage,
  selectCommunityPageCases,
  // feeds
  selectCommunityFeeds,
  selectCommunityFeedsLoading,
  selectCommunityFeedsError,
  selectCommunityFeedsNoMore,
  // cases
  selectCommunityCases,
  selectCommunityCasesLoading,
  selectCommunityCasesError,
  selectCommunityCasesNoMore,
  // report post
  makeSelectReportPopup,
  makeSelectReportLoading,
};
