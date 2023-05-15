/*
 *
 * PersonalProfile reducer
 *
 */
import produce from 'immer';
import * as CONSTANS from './constants';

export const initialState = {
  loading: false,
  error: false,
  profile: false,
  profilePosts: false,
  profileCases: false,
  profileComments: false,
  profileBookmarks: false,
  isReady: false,
  id: false,
  loadingTab: false,
  errorTab: false,
  dataTab: null,
  profileEvents: null,
  tabType: null,
  isReadyTab: false,
};

/* eslint-disable default-case, no-param-reassign */
const personalProfilePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANS.FLUSH_STATE:
        return initialState;

      case CONSTANS.LOAD_EVENTS:
        draft.loadingTab = true;
        draft.errorTab = false;
        draft.dataTab = null;
        draft.isReadyTab = false;
        break;

      case CONSTANS.LOAD_EVENTS_SUCCESS:
        draft.profileEvents = action.dataTab;
        draft.loadingTab = false;
        draft.isReadyTab = true;

        break;

      case CONSTANS.LOAD_EVENTS_ERROR:
        draft.errorTab = action.error;
        draft.loadingTab = false;
        break;

      case CONSTANS.LOAD_PROFILE:
        draft.id = action.id;
        draft.loading = true;
        draft.error = false;
        draft.profile = false;
        draft.profilePosts = false;
        draft.profileCases = false;
        draft.isReady = false;
        break;

      case CONSTANS.LOAD_PROFILE_SUCCESS:
        draft.profile = action.profile.user;
        draft.profilePosts = action.profile.posts.data;
        draft.profileCases = action.profile.cases.data;
        draft.profileComments = action.profile.comments.data;
        draft.profileBookmarks = action.profile.bookmarks.data;
        draft.loading = false;
        draft.isReady = true;
        break;

      case CONSTANS.LOAD_PROFILE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default personalProfilePageReducer;
