/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/saga';
import CaseOverview from 'legacy/pages/CaseOverview/saga';
import CaseDetail from 'legacy/pages/CaseDetail/saga';
import ArticlesOverview from 'legacy/pages/ArticlesOverview/saga';
import ArticleDetail from 'legacy/pages/ArticleDetail/saga';
import Register from 'legacy/pages/Register/saga';
import ResetPassword from 'legacy/pages/ResetPassword/saga';
import SearchBar from 'legacy/pages/SearchBar/saga';
// containers
import TestContainer from 'legacy/containers/TestContainer/saga';
import CommentsOverview from 'legacy/containers/CommentsOverview/saga';
import PersonalSideBar from 'legacy/containers/PersonalSideBar/saga';
import ProfileSuggestions from 'legacy/containers/ProfileSuggestions/saga';
import UploadContent from 'legacy/containers/UploadContent/saga';


export default {
  SagaContainer,
  CaseDetail,
  ArticlesOverview,
  ArticleDetail,
  CaseOverview,
  Register,
  ResetPassword,
  SearchBar,
  // containers
  TestContainer,
  CommentsOverview,
  PersonalSideBar,
  ProfileSuggestions,
  UploadContent,
};