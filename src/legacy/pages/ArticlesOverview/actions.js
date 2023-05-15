import {
  FLUSH_STATE,
  LOAD_ARTICLES,
  LOAD_ARTICLES_ERROR,
  LOAD_ARTICLES_SUCCESS,
  CREATE_ARTICLE,
  CREATE_ARTICLE_SUCCESS,
  CREATE_ARTICLE_ERROR,
} from './constants';

export function flushState() {
  return {
    type: FLUSH_STATE,
  };
}

export function loadArticles(filter) {
  return {
    type: LOAD_ARTICLES,
    filter,
  };
}

export function loadArticlesSuccess(articles) {
  return {
    type: LOAD_ARTICLES_SUCCESS,
    articles,
  };
}

export function loadArticlesError(error) {
  return {
    type: LOAD_ARTICLES_ERROR,
    error,
  };
}

// createArticle
export function createArticle(data) {
  return {
    type: CREATE_ARTICLE,
    data,
  };
}
export function createArticleSuccess(data) {
  return {
    type: CREATE_ARTICLE_SUCCESS,
    data,
  };
}

export function createArticleError(error) {
  return {
    type: CREATE_ARTICLE_ERROR,
    error,
  };
}
