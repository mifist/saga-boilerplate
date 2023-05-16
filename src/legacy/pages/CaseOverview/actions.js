import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadCases(filter) {
  return {
    type: CONSTANTS.LOAD_CASES,
    filter,
  };
}

export function loadCasesSuccess(cases) {
  return {
    type: CONSTANTS.LOAD_CASES_SUCCESS,
    cases,
  };
}

export function loadCasesError(error) {
  return {
    type: CONSTANTS.LOAD_CASES_ERROR,
    error,
  };
}

// CREATE CASE
export function createCase(data) {
  return {
    type: CONSTANTS.CREATE_CASE,
    data,
  };
}

export function createCaseSuccess(caseDetail) {
  return {
    type: CONSTANTS.CREATE_CASE_SUCCESS,
    caseDetail,
  };
}

export function createCaseError(error) {
  return {
    type: CONSTANTS.CREATE_CASE_ERROR,
    error,
  };
}

export function updateLikesCase(publication) {
  return {
    type: CONSTANTS.UPDATE_LIKES,
    publication,
  };
}
