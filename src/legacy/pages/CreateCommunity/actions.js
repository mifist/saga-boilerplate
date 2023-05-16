import * as CONSTANTS from './constants';

export const createCommunity = (values) => ({
  type: CONSTANTS.CREATE_COMMUNITY,
  values,
});

export const createCommunitySuccess = (communityDetails) => ({
  type: CONSTANTS.CREATE_COMMUNITY_SUCCESS,
  communityDetails,
});

export const createCommunityError = (error) => ({
  type: CONSTANTS.CREATE_COMMUNITY_ERROR,
  error,
});
