/*
 *
 * PersonalSideBar reducer
 *
 */
import produce from 'immer';
import {
  FLUSH_STATE,
  LOAD_EVENTS,
  LOAD_EVENTS_ERROR,
  LOAD_EVENTS_SUCCESS,
  LOAD_COMMUNITIES,
  LOAD_COMMUNITIES_SUCCESS,
  LOAD_COMMUNITIES_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  myEvents : false,
  myReplayEvents : false,
  typeLayout: false,
  // communities
  myCommunities: false,
  loadingCommunities: false,
  errorCommunities: false,
};

/* eslint-disable default-case, no-param-reassign */
const personalSideBarReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;
      
      case LOAD_EVENTS:
        draft.loading = true;
        draft.error = false;
        draft.myEvents = false;
        draft.myReplayEvents = false;
        draft.typeLayout = action.typeLayout;
        break;

      case LOAD_EVENTS_SUCCESS:
        draft.myEvents = action.myEvents;
        draft.myReplayEvents = action.myReplayEvents;
        draft.loading = false;
        break;

      case LOAD_EVENTS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      
      
      case LOAD_COMMUNITIES:
        draft.loadingCommunities = true;
        draft.errorCommunities = false;
        break;

      case LOAD_COMMUNITIES_SUCCESS:
        draft.myCommunities = action.myCommunities;
        draft.loadingCommunities = false;
        break;

      case LOAD_COMMUNITIES_ERROR:
        draft.errorCommunities = action.errorCommunities;
        draft.loadingCommunities = false;
      break;
      
    }
  });

export default personalSideBarReducer;
