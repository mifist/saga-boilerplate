/*
 *
 * TestContainer actions
 *
 */

import * as CONSTANS from './constants';

export function defaultAction() {
  return {
    type: CONSTANS.DEFAULT_ACTION,
  };
}

export function flushState() {
  return {
    type: CONSTANS.FLUSH_STATE,
  };
}