/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/saga';
import CaseOverview from 'legacy/pages/CaseOverview/saga';
import CaseDetail from 'legacy/pages/CaseDetail/saga';
import ArticlesOverview from 'legacy/pages/ArticlesOverview/saga';
import ArticleDetail from 'legacy/pages/ArticleDetail/saga';
import CommunitiesOverview from 'legacy/pages/CommunitiesOverview/saga';
import CommunityDetail from 'legacy/pages/CommunityDetail/saga';
import CreateCommunity from 'legacy/pages/CreateCommunity/saga';
import EventDetail from 'legacy/pages/EventDetail/saga';
import EventOverview from 'legacy/pages/EventOverview/saga';
import PodcastDetail from 'legacy/pages/PodcastDetail/saga';
import PodcastsOverview from 'legacy/pages/PodcastsOverview/saga';
import NewsFeed from 'legacy/pages/NewsFeed/saga';
import Register from 'legacy/pages/Register/saga';
import ResetPassword from 'legacy/pages/ResetPassword/saga';
import SearchBar from 'legacy/pages/SearchBar/saga';
import ForgotPassword from 'legacy/pages/ForgotPassword/saga';
import HiddenPosts from 'legacy/pages/HiddenPosts/saga';
import Login from 'legacy/pages/Login/saga';
import Notifications from 'legacy/pages/Notifications/saga';
import PersonalProfile from 'legacy/pages/PersonalProfile/saga';
// containers
import TestContainer from 'legacy/containers/TestContainer/saga';
import CommentsOverview from 'legacy/containers/CommentsOverview/saga';
import PersonalSideBar from 'legacy/containers/PersonalSideBar/saga';
import ProfileSuggestions from 'legacy/containers/ProfileSuggestions/saga';
import UploadContent from 'legacy/containers/UploadContent/saga';
//layouts
import MainLayout from 'layouts/MainLayout/saga';

export default {
  SagaContainer,
  CaseDetail,
  CaseOverview,
  ArticleDetail,
  ArticlesOverview,
  CommunitiesOverview,
  CommunityDetail,
  CreateCommunity,
  EventDetail,
  EventOverview,
  PodcastDetail,
  PodcastsOverview,
  NewsFeed,
  Register,
  ResetPassword,
  SearchBar,
  ForgotPassword,
  HiddenPosts,
  Login,
  Notifications,
  PersonalProfile,
  // containers
  TestContainer,
  CommentsOverview,
  PersonalSideBar,
  ProfileSuggestions,
  UploadContent,
  // layouts
  MainLayout,
};
