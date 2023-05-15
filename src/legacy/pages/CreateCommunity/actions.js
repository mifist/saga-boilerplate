import * as CONSTANS from './constants';

export const createCommunity = values => ({ type: CONSTANS.CREATE_COMMUNITY, values });

export const createCommunitySuccess = communityDetails => ({
  type: CONSTANS.CREATE_COMMUNITY_SUCCESS,
  communityDetails,
});

export const createCommunityError = error => ({
  type: CONSTANS.CREATE_COMMUNITY_ERROR,
  error,
});
