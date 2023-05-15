/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/saga';
import CaseOverview from 'legacy/pages/CaseOverview/saga';
import CaseDetail from 'legacy/pages/CaseDetail/saga';
export default {
  SagaContainer,
  CaseDetail,
  CaseOverview,
};
