import * as CONSTANTS from './constants';

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}

export function loadArticles(filter) {
  return {
    type: CONSTANTS.LOAD_ARTICLES,
    filter,
  };
}

export function loadArticlesSuccess(articles) {
  return {
    type: CONSTANTS.LOAD_ARTICLES_SUCCESS,
    articles,
  };
}

export function loadArticlesError(error) {
  return {
    type: CONSTANTS.LOAD_ARTICLES_ERROR,
    error,
  };
}

// createArticle
export function createArticle(data) {
  return {
    type: CONSTANTS.CREATE_ARTICLE,
    data,
  };
}
export function createArticleSuccess(data) {
  return {
    type: CONSTANTS.CREATE_ARTICLE_SUCCESS,
    data,
  };
}

export function createArticleError(error) {
  return {
    type: CONSTANTS.CREATE_ARTICLE_ERROR,
    error,
  };
}
