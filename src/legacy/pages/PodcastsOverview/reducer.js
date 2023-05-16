import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  podcasts: false,
};

/* eslint-disable default-case, no-param-reassign */
const podcastsOverviewReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      // Load Podcasts by Filter
      case CONSTANTS.LOAD_PODCASTS:
        draft.filter = action.filter;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_PODCASTS_SUCCESS:
        draft.podcasts = action.podcasts;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_PODCASTS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.CREATE_PODCAST:
        draft.loading = false;
        draft.error = false;
        break;

      case CONSTANTS.CREATE_PODCAST_SUCCESS:
        draft.loading = false;
        const { data } = action;
        if (state.podcasts) {
          let i = state.podcasts.data.findIndex((po) => po._id === data._id);

          if (i !== -1) {
            draft.podcasts.data[i] = data;
          } else {
            draft.podcasts.data.unshift(data);
          }
        }

        break;

      case CONSTANTS.CREATE_PODCAST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default podcastsOverviewReducer;
