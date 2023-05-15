import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadCases(filter) {
  return {
    type: CONSTANS.LOAD_CASES,
    filter,
  };
}

export function loadCasesSuccess(cases) {
  return {
    type: CONSTANS.LOAD_CASES_SUCCESS,
    cases,
  };
}

export function loadCasesError(error) {
  return {
    type: CONSTANS.LOAD_CASES_ERROR,
    error,
  };
}

// CREATE CASE
export function createCase(data) {
  return {
    type: CONSTANS.CREATE_CASE,
    data,
  };
}

export function createCaseSuccess(caseDetail) {
  return {
    type: CONSTANS.CREATE_CASE_SUCCESS,
    caseDetail,
  };
}

export function createCaseError(error) {
  return {
    type: CONSTANS.CREATE_CASE_ERROR,
    error,
  };
}

export function updateLikesCase(publication) {
  return {
    type: CONSTANS.UPDATE_LIKES,
    publication,
  };
}
