import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import { LOAD_ARTICLES, CREATE_ARTICLE } from './constants';

import {
  loadArticlesError,
  loadArticlesSuccess,
  createArticleError,
  createArticleSuccess,
} from './actions';

// Load and Filter Articles
export function* loadArticles(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { filter } = action;

    const articles = yield requestWrapper(
      'POST',
      'posts/filter',
      filter,
      currentUser?.token,
    );

    if (!articles && articles.length === 0) {
      yield put(loadArticlesSuccess(false));
    } else {
      yield put(loadArticlesSuccess(articles));
    }
  } catch (err) {
    yield put(loadArticlesError(true));
  }
}

export function* createArticle({ data }) {
  try {
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const reponse = yield requestWrapper(
      'POST',
      'posts/new',
      data,
      currentUser.token,
    );

    if (!reponse) {
      yield put(createArticleSuccess(false));
    } else {
      yield put(createArticleSuccess(reponse[0]));
    }
  } catch (err) {
    yield put(createArticleError(true));
  }
}

// Individual exports for testing
export default function* articlesOverviewSaga() {
  yield takeLatest(LOAD_ARTICLES, loadArticles);
  yield takeLatest(CREATE_ARTICLE, createArticle);
}
