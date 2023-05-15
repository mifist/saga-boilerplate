import * as CONSTANS from './constants';

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}

export function loadArticles(filter) {
  return {
    type: CONSTANS.LOAD_ARTICLES,
    filter,
  };
}

export function loadArticlesSuccess(articles) {
  return {
    type: CONSTANS.LOAD_ARTICLES_SUCCESS,
    articles,
  };
}

export function loadArticlesError(error) {
  return {
    type: CONSTANS.LOAD_ARTICLES_ERROR,
    error,
  };
}

// createArticle
export function createArticle(data) {
  return {
    type: CONSTANS.CREATE_ARTICLE,
    data,
  };
}
export function createArticleSuccess(data) {
  return {
    type: CONSTANS.CREATE_ARTICLE_SUCCESS,
    data,
  };
}

export function createArticleError(error) {
  return {
    type: CONSTANS.CREATE_ARTICLE_ERROR,
    error,
  };
}
