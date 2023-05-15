/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/saga';
import CaseOverview from 'legacy/pages/CaseOverview/saga';
// containers
import TestContainer from 'legacy/containers/TestContainer/saga';
import CommentsOverview from 'legacy/containers/CommentsOverview/saga';
import PersonalSideBar from 'legacy/containers/PersonalSideBar/saga';
import ProfileSuggestions from 'legacy/containers/ProfileSuggestions/saga';
import UploadContent from 'legacy/containers/UploadContent/saga';

export default {
  SagaContainer,
  CaseOverview,
  // containers
  TestContainer,
  CommentsOverview,
  PersonalSideBar,
  ProfileSuggestions,
  UploadContent,
};