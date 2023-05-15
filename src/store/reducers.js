/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/reducer';
import CaseOverview from 'legacy/pages/CaseOverview/reducer';
import CaseDetail from 'legacy/pages/CaseDetail/reducer';
import ArticlesOverview from 'legacy/pages/ArticlesOverview/reducer';
import ArticleDetail from 'legacy/pages/ArticleDetail/reducer';
// containers
import TestContainer from 'legacy/containers/TestContainer/reducer';
import CommentsOverview from 'legacy/containers/CommentsOverview/reducer';
import PersonalSideBar from 'legacy/containers/PersonalSideBar/reducer';
import ProfileSuggestions from 'legacy/containers/ProfileSuggestions/reducer';
import UploadContent from 'legacy/containers/UploadContent/reducer';

export default {
  SagaContainer,
  CaseOverview,
  ArticleDetail,
  CaseDetail,
  ArticlesOverview,
  // containers
  TestContainer,
  CommentsOverview,
  PersonalSideBar,
  ProfileSuggestions,
  UploadContent,
};