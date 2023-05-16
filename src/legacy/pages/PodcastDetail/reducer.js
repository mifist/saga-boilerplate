import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  podcast: false,
  deleteSuccessful: false,
};

/* eslint-disable default-case, no-param-reassign */
const podcastDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      case CONSTANTS.ON_DELETE_SUCCESS:
        draft.deleteSuccessful = true;
        break;

      // Load Podcast
      case CONSTANTS.LOAD_PODCAST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_PODCAST_SUCCESS:
        draft.podcast = action.podcast;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_PODCAST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // Change
      case CONSTANTS.UPDATE_PODCAST:
        if (action.actionType === 'update') {
          draft.loading = true;
        }
        draft.error = false;
        break;

      case CONSTANTS.UPDATE_PODCAST_SUCCESS:
        draft.podcast = action.podcast;
        draft.loading = false;
        break;

      case CONSTANTS.UPDATE_PODCAST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // PIN UNPIN POST
      case CONSTANTS.PIN_UNPIN_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.PIN_UNPIN_POST_SUCCESS:
        draft.loading = false;
        draft.podcast.data.pinned = action.pinned;
        break;

      case CONSTANTS.PIN_UNPIN_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      // HIDE UNHIDE POST
      case CONSTANTS.HIDE_UNHIDE_POST:
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.HIDE_UNHIDE_POST_SUCCESS:
        draft.loading = false;
        draft.podcast.data.hidden = action.hidden;
        break;

      case CONSTANTS.HIDE_UNHIDE_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default podcastDetailReducer;
