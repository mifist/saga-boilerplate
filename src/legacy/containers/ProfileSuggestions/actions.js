/*
 *
 * ProfileSuggestions actions
 *
 */

import * as CONSTANTS from './constants';

export function defaultAction() {
  return {
    type: CONSTANTS.DEFAULT_ACTION,
  };
}

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

/**
export function changeData(filteredProperties) {
  return {
    type: CONSTANTS.CHANGE_DATA,
    filteredProperties,
  };
} */

/**
 * Load the variables, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_VARIABLES
 */
export function loadEvents(typeLayout) {
  return {
    type: CONSTANTS.LOAD_EVENTS,
    typeLayout,
  };
}

/**
 * Dispatched when the loadVariables are loaded by the request saga
 *
 * @param  {array} variables true for variables
 *
 * @return {object}      An action object with a type of LOAD_VARIABLES_SUCCESS passing the variables
 */
export function loadEventsSuccess(events, replayEvents) {
  return {
    type: CONSTANTS.LOAD_EVENTS_SUCCESS,
    events,
    replayEvents,
  };
}

/**
 * Dispatched when loading the loadVariables fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_VARIABLES_ERROR passing the error
 */
export function loadEventsError(error) {
  return {
    type: CONSTANTS.LOAD_EVENTS_ERROR,
    error,
  };
}
