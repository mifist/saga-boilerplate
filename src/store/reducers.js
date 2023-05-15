/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/reducer';
import CaseOverview from 'legacy/pages/CaseOverview/reducer';
import CaseDetail from 'legacy/pages/CaseDetail/reducer';
// containers
import TestContainer from 'legacy/containers/TestContainer/reducer';
import CommentsOverview from 'legacy/containers/CommentsOverview/reducer';
import PersonalSideBar from 'legacy/containers/PersonalSideBar/reducer';

export default {
  SagaContainer,
  CaseOverview,
  CaseDetail,
  // containers
  TestContainer,
  CommentsOverview,
  PersonalSideBar,
};
