/*
 *
 * UploadContent actions
 *
 */

import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

/**
 * Load the variables, this action starts the request saga
 *
 * @return {object} An action object with a type of UPLOAD_CONTENT_FILE
 */
export function uploadContentFile(file, fileType) {
  return {
    type: CONSTANTS.UPLOAD_CONTENT_FILE,
    file,
    fileType,
  };
}

/**
 * Dispatched when the uploadContentFile are loaded by the request saga
 *
 * @param  {array} variables true for variables
 *
 * @return {object}      An action object with a type of UPLOAD_CONTENT_FILE_SUCCESS passing the variables
 */
export function uploadContentFileSuccess(uploadedFile, uploadedFileType) {
  return {
    type: CONSTANTS.UPLOAD_CONTENT_FILE_SUCCESS,
    uploadedFile,
    uploadedFileType,
  };
}

/**
 * Dispatched when loading the uploadContentFile fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of UPLOAD_CONTENT_FILE_ERROR passing the error
 */
export function uploadContentFileError(error) {
  return {
    type: CONSTANTS.UPLOAD_CONTENT_FILE_ERROR,
    error,
  };
}
