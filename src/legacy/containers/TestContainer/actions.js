/*
 *
 * TestContainer actions
 *
 */

import * as CONSTANTS from './constants';

export function defaultAction() {
  return {
    type: CONSTANTS.DEFAULT_ACTION,
  };
}

export function flushState() {
  return {
    type: CONSTANTS.FLUSH_STATE,
  };
}
