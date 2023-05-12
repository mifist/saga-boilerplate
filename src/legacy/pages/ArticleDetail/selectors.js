import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the articleDetail state domain
 */

const selectArticleDetailDomain = state => state.articleDetail || initialState;

/**
 * Other specific selectors
 */

const makeSelectLoading = () =>
  createSelector(
    selectArticleDetailDomain,
    substate => substate.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectArticleDetailDomain,
    substate => substate.error,
  );

const makeSelectArticle = () =>
  createSelector(
    selectArticleDetailDomain,
    substate => substate?.article?.data || substate?.article,
  );

const makeSelectArticleDetail = () =>
  createSelector(
    selectArticleDetailDomain,
    substate => substate,
  );

const selectDeleteSuccessful = () =>
  createSelector(
    selectArticleDetailDomain,
    substate => substate.deleteSuccessful,
  );

export {
  selectArticleDetailDomain,
  makeSelectArticleDetail,
  makeSelectLoading,
  makeSelectError,
  makeSelectArticle,
  selectDeleteSuccessful,
};
