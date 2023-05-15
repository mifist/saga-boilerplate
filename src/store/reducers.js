/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/reducer';
import CaseOverview from 'legacy/pages/CaseOverview/reducer';
import CaseDetail from 'legacy/pages/CaseDetail/reducer';

export default {
  SagaContainer,
  CaseOverview,
  CaseDetail,
};
