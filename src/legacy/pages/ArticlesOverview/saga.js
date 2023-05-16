import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

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
      yield put(ACTIONS.loadArticlesSuccess(false));
    } else {
      yield put(ACTIONS.loadArticlesSuccess(articles));
    }
  } catch (err) {
    yield put(ACTIONS.loadArticlesError(true));
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
      yield put(ACTIONS.createArticleSuccess(false));
    } else {
      yield put(ACTIONS.createArticleSuccess(reponse[0]));
    }
  } catch (err) {
    yield put(ACTIONS.createArticleError(true));
  }
}

// Individual exports for testing
export default function* articlesOverviewSaga() {
  yield takeLatest(CONSTANTS.LOAD_ARTICLES, loadArticles);
  yield takeLatest(CONSTANTS.CREATE_ARTICLE, createArticle);
}
