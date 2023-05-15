import { put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import requestWrapper from 'utils/requestWrapper';

import * as CONSTANS from './constants';
import * as ACTIONS from './actions';

export function* loadEvents(action) {
  const currentUser = yield JSON.parse(localStorage.getItem('beemed_user'));

  try {
    let url = `events?perPage=3&order=ASC&date_from=${moment().format(
      'YYYY-MM-DD',
    )}`;
    let url2 = `events?perPage=3&order=DESC&date_to=${moment()
      .subtract(1, 'month')
      .format('YYYY-MM-DD')}`;
    let results = yield requestWrapper('GET', url, null, 'token', 'events');
    // console.log(results);
    let results2 = yield requestWrapper('GET', url2, null, 'token', 'events');

    let events = {
      title: 'common.beemedUpcomingEvents',
      route: {
        title: 'common.seeMoreEvents',
        to: '/event?eventType=upcoming',
      },
      data: [],
    };

    let replayEvents = {
      title: 'common.availableReplays',
      route: {
        title: 'common.seeMoreReplays',
        to: '/event?eventType=replay',
      },
      data: [],
    };
    let cptEvent = 0;
    let cptReplayEvents = 0;
    for (let i = 0; i < results.data.length; i++) {
      let hour = results.data[i].start_time;
      if (hour === null) {
        hour = '';
      }

      if (cptEvent < 2) {
        let item = {
          img: results.data[i].image_url,
          title: {
            dateFrom: results.data[i].date_from,
            hour,
          },
          description: results.data[i].name,
          type: 'event',
          _id: results.data[i].id,
          date: moment(results.data[i].date_from).unix(),
        };
        events.data.push(item);
        cptEvent++;
      }
    }

    for (let x = 0; x < results2.data.length; x++) {
      let hour2 = results2.data[x].start_time;
      if (hour2 === null) {
        hour2 = '';
      }
      if (cptReplayEvents < 2) {
        let item = {
          img: results2.data[x].image_url,
          title: {
            dateFrom: results2.data[x].date_from,
            hour2,
          },
          description: results2.data[x].name,
          type: 'event',
          _id: results2.data[x].id,
          date: moment(results2.data[x].date_from).unix(),
        };
        replayEvents.data.push(item);
        cptReplayEvents++;
      }
    }
    // let sortedArray = events.data;
    // sortedArray = sortedArray.sort((a, b) => a.date - b.date);
    // events.data = sortedArray;
    // sortedArray = replayEvents.data;
    // sortedArray = sortedArray.sort((a, b) => b.date - a.date);
    // replayEvents.data = sortedArray;
    // console.log(events, replayEvents);

    yield put(ACTIONS.loadEventsSuccess(events, replayEvents));
  } catch (err) {
    yield put(ACTIONS.loadEventsError(true));
  }
}

// Individual exports for testing
export default function* profileSuggestionsSaga() {
  // See example in legacy/containers/HomePage/saga.js
  yield takeLatest(CONSTANS.LOAD_EVENTS, loadEvents);
}
