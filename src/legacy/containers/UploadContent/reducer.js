/*
 *
 * UploadContent reducer
 *
 */
import produce from 'immer';
import {
  UPLOAD_CONTENT_FILE,
  UPLOAD_CONTENT_FILE_SUCCESS,
  UPLOAD_CONTENT_FILE_ERROR,
  FLUSH_STATE,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  uploadedFile: false,
  uploadedFileType: false,
  currentFile: false,
};

/* eslint-disable default-case, no-param-reassign */
const uploadContentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;

      case UPLOAD_CONTENT_FILE:
        draft.loading = true;
        draft.error = false;
        draft.uploadedFileType = false;
        break;

      case UPLOAD_CONTENT_FILE_SUCCESS:
        draft.uploadedFile = action.uploadedFile;
        draft.uploadedFileType = action.uploadedFileType;
        draft.loading = false;
        draft.currentFile = false;
        break;

      case UPLOAD_CONTENT_FILE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.uploadedFile = 'error';
        draft.uploadedFileType = false;
        break;
    }
  });

export default uploadContentReducer;
