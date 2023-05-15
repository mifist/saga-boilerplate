/*
 *
 * PersonalSideBar actions
 *
 */

import {
  DEFAULT_ACTION,
  FLUSH_STATE,
  LOAD_EVENTS,
  LOAD_EVENTS_ERROR,
  LOAD_EVENTS_SUCCESS,
  LOAD_COMMUNITIES,
  LOAD_COMMUNITIES_SUCCESS,
  LOAD_COMMUNITIES_ERROR,
} from './constants';

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
 */
export function loadEvents(typeLayout) {
  return {
    type: LOAD_EVENTS,
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
export function loadEventsSuccess(myEvents, myReplayEvents) {
  return {
    type: LOAD_EVENTS_SUCCESS,
    myEvents,
    myReplayEvents
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
    type: LOAD_EVENTS_ERROR,
    error,
  };
}



export function loadCommunities() {
  return {
    type: LOAD_COMMUNITIES
  };
}

export function loadCommunitiesSuccess(myCommunities) {
  return {
    type: LOAD_COMMUNITIES_SUCCESS,
    myCommunities
  };
}

export function loadCommunitiesError(error) {
  return {
    type: LOAD_COMMUNITIES_ERROR,
    error,
  };
}
