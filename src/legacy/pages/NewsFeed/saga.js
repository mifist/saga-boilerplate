import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

import { notification } from 'antd';

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
      yield put(ACTIONS.uploadImagesSuccess(image));
    }
  } catch (err) {
    // yield put(ACTIONS.uploadPropertyError(true));
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

    events.data.forEach((e) => {
      e.type = 'event';
    });

    if (events.data.length !== 0) {
      yield put(ACTIONS.loadEventsSuccess(events.data));
    } else {
      yield put(ACTIONS.setNoMore('event'));
    }
  } catch (err) {
    yield put(ACTIONS.loadEventsError(err));
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
      yield put(ACTIONS.loadPostsSuccess(newsFeedGroupedData, action.page));
    } else {
      yield put(ACTIONS.setNoMore('post'));
    }
  } catch (err) {
    yield put(ACTIONS.loadPostsError(err));
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
  arr.forEach((el) => {
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
          likes: publication?.likes?.map((like) => ({ _id: like._id })),
        },
        currentUser.token,
      );
    }
    if (updatedCase) {
      yield put(ACTIONS.postPublicationSuccess(updatedCase[0]));
    } else {
      yield put(ACTIONS.postPublicationError('err'));
    }
    // if (publication._id === undefined) {
    //   yield put(ACTIONS.postPublicationSuccess(updatedCase));
    // }
  } catch (err) {
    yield put(ACTIONS.postPublicationError(err));
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
      yield put(ACTIONS.reportPostSuccess(false));
    } else {
      notification.success({ message: report.data });
      yield put(ACTIONS.reportPostSuccess());
    }
  } catch (error) {
    notification.error({ message: 'Something went wrong!' });
    yield put(ACTIONS.reportPostError(error));
  }
}

// Individual exports for testing
export default function* newsFeedListSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CONSTANTS.LOAD_POSTS, loadPosts);
  yield takeLatest(CONSTANTS.LOAD_EVENTS, loadEvents);
  yield takeLatest(CONSTANTS.UPLOAD_IMAGES, uploadImages);
  yield takeLatest(CONSTANTS.POST_PUBLICATION, postPublication);
  yield takeLatest(CONSTANTS.UPDATE_LIKES, postPublication);
  yield takeLatest(CONSTANTS.REPORT_POST, reportPost);
}
