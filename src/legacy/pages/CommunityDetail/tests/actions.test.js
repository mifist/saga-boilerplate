import { flushStateCommunityDetail } from '../actions';
import { FLUSH_STATE_COMMUNITYDETAIL } from '../constants';

describe('CommunityDetail actions', () => {
  describe('FLUSH_STATE_COMMUNITYDETAIL Action', () => {
    it('has a type of FLUSH_STATE_COMMUNITYDETAIL', () => {
      const expected = {
        type: FLUSH_STATE_COMMUNITYDETAIL,
      };
      expect(flushSflushStateCommunityDetailate()).toEqual(expected);
    });
  });
});
