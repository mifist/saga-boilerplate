/*
 *
 * TestContainer actions
 *
 */

import { DEFAULT_ACTION, FLUSH_STATE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

/**
export function changeData(filteredProperties) {
  return {
    type: CHANGE_DATA,
    filteredProperties,
  };
} */

/**
 * Load the variables, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_VARIABLES

export function loadVariables() {
  return {
    type: LOAD_VARIABLES,
  };
} */

/**
 * Dispatched when the loadVariables are loaded by the request saga
 *
 * @param  {array} variables true for variables
 *
 * @return {object}      An action object with a type of LOAD_VARIABLES_SUCCESS passing the variables

export function loadVariablesSuccess(variables) {
  return {
    type: LOAD_VARIABLES_SUCCESS,
    variables,
  };
} */

/**
 * Dispatched when loading the loadVariables fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_VARIABLES_ERROR passing the error

export function loadVariablesError(error) {
  return {
    type: LOAD_VARIABLES_ERROR,
    error,
  };
}*/
