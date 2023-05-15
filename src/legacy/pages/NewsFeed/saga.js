import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import {
  LOAD_EVENTS,
  LOAD_POSTS,
  POST_PUBLICATION,
  UPDATE_LIKES,
  UPLOAD_IMAGES,
  REPORT_POST,
} from './constants';
import {
  loadEventsError,
  loadEventsSuccess,
  loadPostsError,
  loadPostsSuccess,
  postPublicationError,
  postPublicationSuccess,
  setNoMore,
  uploadImagesSuccess,
  reportPostError,
  reportPostSuccess,
} from './actions';

import { notification } from 'antd';
import moment from 'moment';

// Update files for Single Case
export function* uploadImages(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    // const propertyData = yield select(makeSelectProperty());

    const image = yield requestWrapper(
      'POST-FORM-DATA',
      'posts/upload/',
      action.images,
      currentUser.token,
    );

    if (!image) {
    } else {
      yield put(uploadImagesSuccess(image));
    }
  } catch (err) {
    // yield put(uploadPropertyError(true));
  }
}

export function* loadEvents(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    // we get the campaigns linked to the user
    const events = yield requestWrapper(
      'GET',
      `events?perPage=3&page=${action.page}`,
      '',
      currentUser.token,
      'events',
    );

    events.data.forEach(e => {
      e.type = 'event';
    });

    if (events.data.length !== 0) {
      yield put(loadEventsSuccess(events.data));
    } else {
      yield put(setNoMore('event'));
    }
  } catch (err) {
    yield put(loadEventsError(err));
  }
}

export function* loadPosts(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { page } = action;

    const bodyRequest = {
      limit: 10,
      page: page,
      filter: null,
    };

    // we get the campaigns linked to the user
    const newsfeedPosts = yield requestWrapper(
      'POST',
      'posts/newsfeed',
      bodyRequest,
      currentUser?.token,
    );
    // console.log(newsfeedPosts);

    // we get the campaigns linked to the user
    // const events = yield requestWrapper(
    //   'GET',
    //   `events?perPage=4&page=${action.page}`,
    //   '',
    //   currentUser.token,
    //   'events',
    // );

    // events.data.forEach(e => {
    //   e.type = 'event';
    // });

    let newsFeedGroupedData = [];

    if (action.page == 1) {
      newsFeedGroupedData = [...newsfeedPosts.pinned, ...newsfeedPosts.data];
    } else {
      newsFeedGroupedData = [...newsfeedPosts.data];
    }

    if (newsFeedGroupedData.length !== 0) {
      yield put(loadPostsSuccess(newsFeedGroupedData, action.page));
    } else {
      yield put(setNoMore('post'));
    }
  } catch (err) {
    yield put(loadPostsError(err));
  }
}

// not use anymore
function grouper(arr) {
  let groupedData = [];
  let caseArr = [];
  let postArr = [];
  let articleArr = [];
  let podcastArr = [];
  let eventArr = [];
  arr.forEach(el => {
    switch (el.type) {
      case 'case':
        caseArr.push(el);
        break;
      case 'post':
        postArr.push(el);
        break;
      case 'article':
        // articleArr.push(el);
        break;
      case 'podcast':
        podcastArr.push(el);
        break;
      case 'event':
        eventArr.push(el);
        break;
      default:
        groupedData.push(el);
    }
  });

  const mapOfPosts = new Map([
    ['case', caseArr],
    ['post', postArr],
    //['article', articleArr],
    ['podcast', podcastArr],
    ['event', eventArr],
  ]);

  for (const value of mapOfPosts.values()) {
    while (value.length !== 0) {
      for (const ele of mapOfPosts.values()) {
        const head = ele.shift();
        head && groupedData.push(head);
      }
    }
  }

  return groupedData;
}

// Update for Single Case
export function* postPublication(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { publication } = action;
    let updatedCase;

    if (publication._id === undefined) {
      updatedCase = yield requestWrapper(
        'POST',
        'posts/new',
        publication,
        currentUser.token,
      );
    } else {
      updatedCase = yield requestWrapper(
        'PATCH',
        'posts',
        {
          _id: publication?._id,
          likes: publication?.likes?.map(like => ({ _id: like._id })),
        },
        currentUser.token,
      );
    }
    if (updatedCase) {
      yield put(postPublicationSuccess(updatedCase[0]));
    } else {
      yield put(postPublicationError('err'));
    }
    // if (publication._id === undefined) {
    //   yield put(postPublicationSuccess(updatedCase));
    // }
  } catch (err) {
    yield put(postPublicationError(err));
  }
}

export function* reportPost(action) {
  try {
    const { postId } = action.data;
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const report = yield requestWrapper(
      'POST',
      `posts/${postId}/report`,
      action.data,
      currentUser.token,
    );

    if (!report) {
      notification.error({ message: 'Something went wrong!' });
      yield put(reportPostSuccess(false));
    } else {
      notification.success({ message: report.data });
      yield put(reportPostSuccess());
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong!' });
    yield put(reportPostError(error));
  }
}

// Individual exports for testing
export default function* newsFeedListSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOAD_POSTS, loadPosts);
  yield takeLatest(LOAD_EVENTS, loadEvents);
  yield takeLatest(UPLOAD_IMAGES, uploadImages);
  yield takeLatest(POST_PUBLICATION, postPublication);
  yield takeLatest(UPDATE_LIKES, postPublication);
  yield takeLatest(REPORT_POST, reportPost);
}
