import { flushStateTesttest } from '../actions';
import { FLUSH_STATE_TESTTEST } from '../constants';

describe('Testtest actions', () => {
  describe('FLUSH_STATE_TESTTEST Action', () => {
    it('has a type of FLUSH_STATE_TESTTEST', () => {
      const expected = {
        type: FLUSH_STATE_TESTTEST,
      };
      expect(flushSflushStateTesttestate()).toEqual(expected);
    });
  });
});
