import { put, takeLatest } from 'redux-saga/effects';
import requestWrapper from 'utils/requestWrapper';
import history from 'utils/history';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

import { notification } from 'antd';
import i18n from 'i18next';

export function* loadCommunityDetail(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id } = action;

    if (currentUser) {
      // we get the campaigns linked to the communityDetail
      const communityDetailData = yield requestWrapper(
        'GET',
        `communities/${id}`,
        '',
        currentUser.token,
      );
      // TODO : check community result, if contain access denied => redirect to community overview page

      if (!communityDetailData) {
        yield put(ACTIONS.loadCommunityDetailSuccess(false));
      } else {
        yield put(ACTIONS.loadCommunityDetailSuccess(communityDetailData));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.loadCommunityDetailError(error));
  }
}

export function* changeCommunityDetail(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { communityDetailData } = action;

    if (currentUser) {
      let changedCommunityDetail = false,
        isNew = !communityDetailData.hasOwnProperty('_id');

      if (isNew) {
        changedCommunityDetail = yield requestWrapper(
          'POST',
          'communities/new/',
          communityDetailData,
          currentUser.token,
        );
        notification.success({ message: i18n.t('common.created') });
      } else {
        changedCommunityDetail = yield requestWrapper(
          'PATCH',
          'communities/',
          communityDetailData,
          currentUser.token,
        );
        notification.success({ message: i18n.t('common.updated') });
      }

      if (!changedCommunityDetail) {
        yield put(ACTIONS.changeCommunityDetailSuccess(false));
      } else {
        // if new we update the url, item props will be updated
        if (isNew) {
          history.push({
            pathname: `/community/detail/` + communityDetailData._id,
          });
        }
        yield put(ACTIONS.changeCommunityDetailSuccess(changedCommunityDetail));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.changeCommunityDetailError(error));
  }
}

export function* deleteCommunityDetail(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id } = action;
    if (currentUser) {
      const deleteCommunityDetail = yield requestWrapper(
        'PATCH',
        `communities/remove`,
        {
          _id: id,
          active: false,
        },
        currentUser.token,
      );

      if (deleteCommunityDetail) {
        yield put(ACTIONS.deleteCommunityDetailSuccess());
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.deleteCommunityDetailError(error));
  }
}

// All Tags
export function* loadCommunityTags(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id } = action;
    if (currentUser) {
      // we get the campaigns linked to the communityDetail
      const communityTags = yield requestWrapper(
        'GET',
        `communities/tags/${id}`,
        '',
        currentUser.token,
      );

      if (!communityTags) {
        yield put(ACTIONS.loadCommunityTagsSuccess(false));
      } else {
        yield put(ACTIONS.loadCommunityTagsSuccess(communityTags));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.loadCommunityTagsError(error));
  }
}

// Popular Tags
export function* loadCommunityPopularTags(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id } = action;
    if (currentUser) {
      // we get the campaigns linked to the communityDetail
      const communityPopularTags = yield requestWrapper(
        'GET',
        `communities/tags/popular/${id}`,
        '',
        currentUser.token,
      );

      if (!communityPopularTags) {
        yield put(ACTIONS.loadCommunityDetailTagsSuccess(false));
      } else {
        yield put(ACTIONS.loadCommunityDetailTagsSuccess(communityPopularTags));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.loadCommunityDetailTagsError(error));
  }
}

// Media
// Update files for Single Case
export function* uploadMediaSaga(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    const { media } = action;

    if (currentUser) {
      const uploadMedia = yield requestWrapper(
        'POST-FORM-DATA',
        'communities/upload/',
        media,
        currentUser.token,
      );

      if (!uploadMedia) {
        yield put(ACTIONS.uploadCommunityMediaSuccess(false));
      } else {
        yield put(ACTIONS.uploadCommunityMediaSuccess(uploadMedia));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (err) {
    yield put(ACTIONS.uploadCommunityMediaError(err));
  }
}

// Load Feeds
export function* loadCommunityFeedSaga(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { id, page, filter, entity } = action;

    if (currentUser) {
      const bodyFeed = {
        limit: 10,
        page: page,
        filter: filter,
      };
      // console.log(bodyFeed);

      // we get the campaigns linked to the communityDetail
      // { communitiesTotal, postsTotal,casesTotal, pinned: [], pinned_cases: [], communities: [],posts: [], cases: [] }
      const feeds = yield requestWrapper(
        'POST',
        `communities/feeds/${id}`,
        bodyFeed,
        currentUser.token,
      );
      // console.log(feeds);

      const commFedd = [...feeds.posts, ...feeds.cases];

      let communityFeeds =
        entity == 'post' ? [...feeds.posts] : [...feeds.cases];

      // if (filter?.sort !== 'newest') {
      //   communityFeeds = entity == 'post' ? commFedd : [...feeds.cases];
      // }

      const feedsTotal = feeds?.postsTotal !== 0 ? feeds?.postsTotal : null;
      const feedsTotalCases =
        feeds?.casesTotal !== 0 ? feeds?.casesTotal : null;
      const total = entity == 'post' ? feedsTotal : feedsTotalCases;

      if (!communityFeeds) {
        yield put(ACTIONS.loadCommunityFeedSuccess(false, page, total));
        //  yield put(ACTIONS.setNoMore('post'));
      } else {
        yield put(ACTIONS.loadCommunityFeedSuccess(communityFeeds, page, total));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (error) {
    yield put(ACTIONS.loadCommunityFeedError(error));
  }
}

// Post Publication
export function* postPublicationSaga(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const { publication } = action;
    let updatedPublication = false,
      isNew =
        !publication.hasOwnProperty('_id') || publication._id === undefined;

    if (isNew) {
      updatedPublication = yield requestWrapper(
        'POST',
        'posts/new/',
        publication,
        currentUser.token,
      );
      notification.success({ message: i18n.t('common.created') });
    } else {
      updatedPublication = yield requestWrapper(
        'PATCH',
        `posts`,
        publication,
        currentUser.token,
      );
      notification.success({ message: i18n.t('common.updated') });
    }

    if (!updatedPublication) {
      yield put(ACTIONS.postPublicationSuccess(false));
    } else {
      yield put(ACTIONS.postPublicationSuccess(updatedPublication[0]));
    }
  } catch (error) {
    yield put(ACTIONS.postPublicationError(error));
  }
}

// Update for Single Post/Case
export function* updateLike(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));
    const updatedPublication = yield requestWrapper(
      'PATCH',
      `posts`,
      {
        _id: action.publication?._id,
        likes: action.publication?.likes?.map(like => ({ _id: like._id })),
        community: action.publication?.community,
      },
      currentUser.token,
    );

    if (!updatedPublication) {
      yield put(ACTIONS.postPublicationSuccess(false));
    } else {
      yield put(ACTIONS.postPublicationSuccess(updatedPublication));
    }
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
      notification.error({ message: i18n.t('common.somethingWentWrong') });
      yield put(ACTIONS.reportPostSuccess(false));
    } else {
      notification.success({ message: report.data });
      yield put(ACTIONS.reportPostSuccess());
    }
  } catch (error) {
    notification.error({ message: i18n.t('common.somethingWentWrong') });
    yield put(ACTIONS.reportPostError(error));
  }
}

export default function* communityDetailSaga() {
  yield takeLatest(CONSTANS.LOAD_COMMUNITYDETAIL, loadCommunityDetail);
  yield takeLatest(CONSTANS.CHANGE_COMMUNITYDETAIL, changeCommunityDetail);
  yield takeLatest(CONSTANS.DELETE_COMMUNITYDETAIL, deleteCommunityDetail);
  // all tags
  yield takeLatest(CONSTANS.LOAD_TAGS, loadCommunityTags);
  // popular tags
  yield takeLatest(CONSTANS.LOAD_COMMUNITYDETAIL_TAGS, loadCommunityPopularTags);
  // media
  yield takeLatest(CONSTANS.UPLOAD_MEDIA, uploadMediaSaga);
  // feeds
  yield takeLatest(CONSTANS.LOAD_FEEDS, loadCommunityFeedSaga);
  // post publication
  yield takeLatest(CONSTANS.POST_PUBLICATION, postPublicationSaga);

  yield takeLatest(CONSTANS.UPDATE_LIKES, updateLike);

  yield takeLatest(CONSTANS.REPORT_POST, reportPost);
}
