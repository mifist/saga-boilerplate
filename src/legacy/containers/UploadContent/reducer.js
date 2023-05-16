/*
 *
 * UploadContent reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  uploadedFile: false,
  uploadedFileType: false,
  currentFile: false,
};

/* eslint-disable default-case, no-param-reassign */
const uploadContentReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.UPLOAD_CONTENT_FILE:
        draft.loading = true;
        draft.error = false;
        draft.uploadedFileType = false;
        break;

      case CONSTANTS.UPLOAD_CONTENT_FILE_SUCCESS:
        draft.uploadedFile = action.uploadedFile;
        draft.uploadedFileType = action.uploadedFileType;
        draft.loading = false;
        draft.currentFile = false;
        break;

      case CONSTANTS.UPLOAD_CONTENT_FILE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.uploadedFile = 'error';
        draft.uploadedFileType = false;
        break;
    }
  });

export default uploadContentReducer;
