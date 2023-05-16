import produce from 'immer';
import * as CONSTANTS from './constants';

export const initialState = {
  loading: false,
  error: false,
  articles: false,
  article: false,
  image: false,
};

/* eslint-disable default-case, no-param-reassign */
const articlesOverviewReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FLUSH_STATE:
        return initialState;

      // Load Articles by Filter
      case CONSTANTS.LOAD_ARTICLES:
        draft.filter = action.filter;
        draft.loading = true;
        draft.error = false;
        break;

      case CONSTANTS.LOAD_ARTICLES_SUCCESS:
        draft.articles = action.articles;
        draft.loading = false;
        break;

      case CONSTANTS.LOAD_ARTICLES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case CONSTANTS.CREATE_ARTICLE:
        draft.loading = false;
        draft.error = false;
        break;

      case CONSTANTS.CREATE_ARTICLE_SUCCESS:
        draft.loading = false;
        const { data } = action;
        if (state.articles) {
          let i = state.articles.data.findIndex((po) => po._id === data._id);

          if (i !== -1) {
            draft.articles.data[i] = data;
          } else {
            draft.articles.data.unshift(data);
          }
        }

        break;

      case CONSTANTS.CREATE_ARTICLE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default articlesOverviewReducer;
