/*
 *
 * CommunitiesOverview actions
 *
 */

import * as CONSTANS from './constants';

/**
 * Clearing the state for CommunitiesOverview
 */
export function flushStateCommunitiesOverview() {
  return {
    type: CONSTANS.FLUSH_STATE_COMMUNITIESOVERVIEW,
  };
}

/**
 * ------------------ LOAD ------------------
 */

/**
 * Load the CommunitiesOverview, this action starts the request saga
 *
 * @return {array} An action object with a type of LOAD_COMMUNITIES
 */
export function loadMyCommunities() {
  return {
    type: CONSTANS.LOAD_MY_COMMUNITIES,
  };
}

/**
 * Dispatched when the loadCommunitiesOverview are loaded by the request saga
 *
 * @param  {array} variables true for CommunitiesOverview
 *
 * @return {array} An action object with a type of LOAD_COMMUNITIES_SUCCESS passing the variables
 */
export function loadMyCommunitiesSuccess(myCommunities) {
  return {
    type: CONSTANS.LOAD_MY_COMMUNITIES_SUCCESS,
    myCommunities,
  };
}

/**
 * Dispatched when loading the loadCommunitiesOverview fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of LOAD_COMMUNITIES_ERROR passing the error
 */
export function loadMyCommunitiesError(error) {
  return {
    type: CONSTANS.LOAD_MY_COMMUNITIES_ERROR,
    error,
  };
}

/**
 * Load the CommunitiesOverview, this action starts the request saga
 *
 * @return {array} An action object with a type of LOAD_ACTIVE_COMMUNITIES
 */
export function loadActiveCommunities(filter) {
  return {
    type: CONSTANS.LOAD_ACTIVE_COMMUNITIES,
    filter,
  };
}

/**
 * Dispatched when the loadCommunitiesOverview are loaded by the request saga
 *
 * @param  {array} variables true for CommunitiesOverview
 *
 * @return {array} An action object with a type of LOAD_ACTIVE_COMMUNITIES_SUCCESS passing the variables
 */
export function loadActiveCommunitiesSuccess(activeCommunities) {
  return {
    type: CONSTANS.LOAD_ACTIVE_COMMUNITIES_SUCCESS,
    activeCommunities,
  };
}

/**
 * Dispatched when loading the loadCommunitiesOverview fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of LOAD_ACTIVE_COMMUNITIES_ERROR passing the error
 */
export function loadActiveCommunitiesError(error) {
  return {
    type: CONSTANS.LOAD_ACTIVE_COMMUNITIES_ERROR,
    error,
  };
}

/**
 * update active communities when sending join request
 */
export function updateCommunityRequestJoinsById(id, newCommunityData) {
  return {
    type: CONSTANS.UPDATE_COMMUNITY_REQUEST_JOINS_BY_ID,
    id,
    newCommunityData,
  };
}
/**
 * update active communities when acception or rejecting Invitation
 */
export function updateCommunityInvitationsById(id, newCommunityData) {
  return {
    type: CONSTANS.UPDATE_COMMUNITY_INVITATIONS_BY_ID,
    id,
    newCommunityData,
  };
}
