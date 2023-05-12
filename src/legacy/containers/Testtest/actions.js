/*
 *
 * Testtest actions
 *
 */

import {
  FLUSH_STATE_TESTTEST,
  LOAD_TESTTEST,
  LOAD_TESTTEST_SUCCESS,
  LOAD_TESTTEST_ERROR,
  CHANGE_TESTTEST,
  CHANGE_TESTTEST_SUCCESS,
  CHANGE_TESTTEST_ERROR,
  DELETE_TESTTEST,
  DELETE_TESTTEST_SUCCESS,
  DELETE_TESTTEST_ERROR,
} from './constants';

/**
 * Clearing the state for Testtest
 */
export function flushStateTesttest() {
  return {
    type: FLUSH_STATE_TESTTEST,
  };
}

/**
 * ------------------ LOAD ------------------
 */

/**
 * Load the Testtest, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_TESTTEST
 */
export function loadTesttest(id) {
  return {
    type: LOAD_TESTTEST,
    id,
  };
}

/**
 * Dispatched when the loadTesttest are loaded by the request saga
 *
 * @param  {object} variable true for Testtest
 *
 * @return {object} An action object with a type of LOAD_TESTTEST_SUCCESS passing the variables
 */
export function loadTesttestSuccess(testtestData) {
  return {
    type: LOAD_TESTTEST_SUCCESS,
    testtestData,
  };
}

/**
 * Dispatched when loading the loadTesttest fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of LOAD_TESTTEST_ERROR passing the error
 */
export function loadTesttestError(error) {
  return {
    type: LOAD_TESTTEST_ERROR,
    error,
  };
}

/**
 * ------------------ CHANGE ------------------
 */

/**
 * Change/Update the Testtest, this action starts the request saga
 *
 * @return {object} An action object with a type of CHANGE_TESTTEST
 */
export function changeTesttest(testtestData) {
  return {
    type: CHANGE_TESTTEST,
    testtestData,
  };
}

/**
 * Dispatched when the changeTesttest are changed/updated by the request saga
 *
 * @param  {object} variable true for Testtest
 *
 * @return {object} An action object with a type of CHANGE_TESTTEST_SUCCESS passing the variables
 */
export function changeTesttestSuccess(testtestData) {
  return {
    type: CHANGE_TESTTEST_SUCCESS,
    testtestData,
  };
}

/**
 * Dispatched when loading the changeTesttest fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of CHANGE_TESTTEST_ERROR passing the error
 */
export function changeTesttestError(error) {
  return {
    type: CHANGE_TESTTEST_ERROR,
    error,
  };
}

/**
 * ------------------ DELETE ------------------
 */

/**
 * Delete the Testtest, this action starts the request saga
 *
 * @return {object} An action object with a type of DELETE_TESTTEST
 */
export function deleteTesttest(id) {
  return {
    type: DELETE_TESTTEST,
    id,
  };
}

/**
 * Dispatched when the deleteTesttest are deleted by the request saga
 *
 * @param  {object} variable true for Testtest
 *
 * @return {object} An action object with a type of DELETE_TESTTEST_SUCCESS passing the variables
 */
export function deleteTesttestSuccess() {
  return {
    type: DELETE_TESTTEST_SUCCESS,
  };
}

/**
 * Dispatched when loading the deleteTesttest fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of DELETE_TESTTEST_ERROR passing the error
 */
export function deleteTesttestError(error) {
  return {
    type: DELETE_TESTTEST_ERROR,
    error,
  };
}
