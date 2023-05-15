/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/reducer';
import caseOverview from 'legacy/pages/CaseOverview/reducer';
import Testtest from 'legacy/containers/Testtest/reducer';

export default {
  SagaContainer,
  caseOverview,
  Testtest,
};
