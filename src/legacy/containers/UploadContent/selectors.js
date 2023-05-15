import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the uploadContent state domain
 */

const selectUploadContentDomain = state => state.uploadContent || initialState;

/**
 * Other specific selectors
 */

const makeSelectLoading = () =>
  createSelector(
    selectUploadContentDomain,
    substate => substate.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectUploadContentDomain,
    substate => substate.error,
  );

const makeSelectUploadedFile = () =>
  createSelector(
    selectUploadContentDomain,
    substate => substate.uploadedFile,
  );
const makeSelectUploadedFileType = () =>
  createSelector(
    selectUploadContentDomain,
    substate => substate.uploadedFileType,
  );

/**
 * Default selector used by UploadContent
 */

const makeSelectUploadContent = () =>
  createSelector(
    selectUploadContentDomain,
    substate => substate,
  );

// export default makeSelectUploadContent;
export {
  makeSelectUploadContent,
  selectUploadContentDomain,
  makeSelectError,
  makeSelectLoading,
  makeSelectUploadedFile,
  makeSelectUploadedFileType,
};
