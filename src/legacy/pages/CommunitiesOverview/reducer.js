/*
 *
 * CommunitiesOverview reducer
 *
 */
import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  myCommunitiesLoading: false,
  activeCommunitiesLoading: false,
  error: false,
  deleteSuccessful: false,
  myCommunities: [],
  activeCommunities: [],
  user_id: false,
};

/* eslint-disable default-case, no-param-reassign */
const communitiesOverviewReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      // LOAD
      case CONSTANTS.LOAD_MY_COMMUNITIES:
        draft.filter = action.filter;
        draft.myCommunitiesLoading = true;
        draft.error = false;
        break;
      case CONSTANTS.LOAD_MY_COMMUNITIES_SUCCESS:
        draft.myCommunities = action.myCommunities;
        draft.myCommunitiesLoading = false;
        break;
      case CONSTANTS.LOAD_MY_COMMUNITIES_ERROR:
        draft.error = action.error;
        draft.myCommunitiesLoading = false;
        break;

      // LOAD ACTIVE COMMUNITIES
      case CONSTANTS.LOAD_ACTIVE_COMMUNITIES:
        draft.activeCommunitiesLoading = true;
        draft.error = false;
        break;
      case CONSTANTS.LOAD_ACTIVE_COMMUNITIES_SUCCESS:
        draft.activeCommunities = action.activeCommunities;
        draft.activeCommunitiesLoading = false;
        break;
      case CONSTANTS.LOAD_ACTIVE_COMMUNITIES_ERROR:
        draft.error = action.error;
        draft.activeCommunitiesLoading = false;
        break;

      case CONSTANTS.UPDATE_COMMUNITY_REQUEST_JOINS_BY_ID:
        let foundedIndex = draft.activeCommunities?.data?.findIndex(
          (a) => a._id === action.id,
        );

        draft.activeCommunities.data[foundedIndex].requests_join =
          action.newCommunityData.community.requests_join;
        break;

      case CONSTANTS.UPDATE_COMMUNITY_INVITATIONS_BY_ID:
        if (!action.newCommunityData?.rejected) {
          draft.activeCommunities.data = draft.activeCommunities.data.filter(
            (community) => community._id !== action.id,
          );
          draft.myCommunities.data.push(action.newCommunityData.community);
        } else {
          let foundedIndex2 = draft.activeCommunities?.data?.findIndex(
            (a) => a._id === action.id,
          );

          draft.activeCommunities.data[foundedIndex2].invitations =
            action.newCommunityData?.community?.invitations;
        }

        break;
    }
  });

export default communitiesOverviewReducer;
