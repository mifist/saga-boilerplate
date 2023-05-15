import {
  FLUSH_STATE,
  LOAD_CASES,
  LOAD_CASES_ERROR,
  LOAD_CASES_SUCCESS,
  CREATE_CASE,
  CREATE_CASE_ERROR,
  CREATE_CASE_SUCCESS,
  UPDATE_LIKES,
} from './constants';

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

export function loadCases(filter) {
  return {
    type: LOAD_CASES,
    filter,
  };
}

export function loadCasesSuccess(cases) {
  return {
    type: LOAD_CASES_SUCCESS,
    cases,
  };
}

export function loadCasesError(error) {
  return {
    type: LOAD_CASES_ERROR,
    error,
  };
}

// CREATE CASE
export function createCase(data) {
  return {
    type: CREATE_CASE,
    data,
  };
}

export function createCaseSuccess(caseDetail) {
  return {
    type: CREATE_CASE_SUCCESS,
    caseDetail,
  };
}

export function createCaseError(error) {
  return {
    type: CREATE_CASE_ERROR,
    error,
  };
}

export function updateLikesCase(publication) {
  return {
    type: UPDATE_LIKES,
    publication,
  };
}
