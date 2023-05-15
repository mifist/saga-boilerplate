import { put, takeLatest } from 'redux-saga/effects';
import { LOAD_EVENTS, LOAD_COMMUNITIES } from './constants';
import {
  loadEventsError,
  loadEventsSuccess,
  loadCommunitiesSuccess,
  loadCommunitiesError,
} from './actions';

import moment from 'moment';

import requestWrapper from 'utils/requestWrapper';

export function* loadEvents(action) {
  const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

  try {
    const userEvents = yield requestWrapper(
      'GET',
      'users/paid-events',
      null,
      currentUser.token,
    );
    const currentDate = moment();
    let myEvents = {
      title: 'common.myUpcomingEvents',
      route: {
        title: 'common.seeMoreEvents',
        to: '/event?',
      },
      data: [],
    };

    let myReplayEvents = {
      title: 'common.myReplays',
      route: {
        title: 'common.seeMoreReplays',
        to: '/event?eventType=replay',
      },
      data: [],
    };

    let cptEvent = 0;
    let cptReplayEvents = 0;
    for (let i = 0; i < userEvents.length; i++) {
      let hour = userEvents[i]?.econgress?.start_time;

      let item = {
        img: userEvents[i]?.econgress?.image_url,
        title: {
          dateFrom: userEvents[i]?.econgress?.date_from,
          hour,
        },
        description: userEvents[i]?.econgress?.name,
        type: 'event',
        _id: userEvents[i]?.econgress?.id,
        date: moment(userEvents[i]?.econgress?.date_from).unix(),
      };
      if (currentDate > moment(userEvents[i].econgress?.date_from)) {
        myReplayEvents.data.push(item);
        // if (cptReplayEvents < 3) {
        //
        // }
        cptReplayEvents++;
      } else {
        myEvents.data.push(item);
        // if (cptEvent < 3) {
        //
        // }
        cptEvent++;
      }
    }

    let sortedArray = myEvents.data;
    sortedArray = sortedArray.sort((a, b) => a.date - b.date);
    myEvents.data = sortedArray.slice(0, 3);
    sortedArray = myReplayEvents.data;
    sortedArray = sortedArray.sort((a, b) => b.date - a.date);
    myReplayEvents.data = sortedArray.slice(0, 3);

    yield put(loadEventsSuccess(myEvents, myReplayEvents));
  } catch (err) {
    yield put(loadEventsError(true));
  }
}

export function* loadCommunities(action) {
  try {
    // we retrieve the token from the local storage
    const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

    if (currentUser) {
      // we get the campaigns linked to the communitiesOverview
      const communitiesList = yield requestWrapper(
        'GET',
        `communities/user/${currentUser?._id}`,
        null,
        currentUser.token,
      );

      let myCommunities = {
        // title: 'My communities',
        route: {
          title: 'common.seeMoreCommunities',
          to: `/community`,
        },
        data: [],
      };

      if (!communitiesList?.data) {
        yield put(loadCommunitiesSuccess(myCommunities));
      } else {
        myCommunities.data = communitiesList?.data.slice(0, 3);
        yield put(loadCommunitiesSuccess(myCommunities));
      }
    } else {
      console.error('Unauthorized Error');
    }
  } catch (err) {
    yield put(loadCommunitiesError(true));
  }
}

// Individual exports for testing
export default function* personalSideBarSaga() {
  // See example in legacy/containers/HomePage/saga.js
  yield takeLatest(LOAD_EVENTS, loadEvents);
  yield takeLatest(LOAD_COMMUNITIES, loadCommunities);
}
