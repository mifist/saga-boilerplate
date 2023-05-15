import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCaseDetailDomain = state => state.caseDetail || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectCaseDetailDomain,
    substate => substate.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectCaseDetailDomain,
    substate => substate.error,
  );

const makeSelectCaseData = () =>
  createSelector(
    selectCaseDetailDomain,
    substate => substate.caseData.data,
  );

const makeSelectCaseDetail = () =>
  createSelector(
    selectCaseDetailDomain,
    substate => substate,
  );

const selectDeleteSuccessful = () =>
  createSelector(
    selectCaseDetailDomain,
    substate => substate.deleteSuccessful,
  );

const makeSelectCommunityTags = () =>
  createSelector(
    selectCaseDetailDomain,
    substate => substate.communityTags,
  );

export {
  selectDeleteSuccessful,
  selectCaseDetailDomain,
  makeSelectCaseDetail,
  makeSelectLoading,
  makeSelectError,
  makeSelectCaseData,
  makeSelectCommunityTags,
};
