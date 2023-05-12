import { flushState } from '../actions';
import { FLUSH_STATE } from '../constants';

describe('ArticleDetail actions', () => {
  describe('flushState Action', () => {
    it('has a type of FLUSH_STATE', () => {
      const expected = {
        type: FLUSH_STATE,
      };
      expect(flushState()).toEqual(expected);
    });
  });
});