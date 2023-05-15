/**
 * Combine all reducers in this file and export the combined reducers.
 */

import SagaContainer from 'pages/SagaContainer/reducer';
import CaseOverview from 'legacy/pages/CaseOverview/reducer';
import CaseDetail from 'legacy/pages/CaseDetail/reducer';
import ArticlesOverview from 'legacy/pages/ArticlesOverview/reducer';
import ArticleDetail from 'legacy/pages/ArticleDetail/reducer';
import CommunitiesOverview from 'legacy/pages/CommunitiesOverview/reducer';
import CommunityDetail from 'legacy/pages/CommunityDetail/reducer';
import CreateCommunity from 'legacy/pages/CreateCommunity/reducer';
import EventDetail from 'legacy/pages/EventDetail/reducer';
import EventOverview from 'legacy/pages/EventOverview/reducer';
import PodcastDetail from 'legacy/pages/PodcastDetail/reducer';
import PodcastsOverview from 'legacy/pages/PodcastsOverview/reducer';
import NewsFeed from 'legacy/pages/NewsFeed/reducer';
import Register from 'legacy/pages/Register/reducer';
import ResetPassword from 'legacy/pages/ResetPassword/reducer';
import SearchBar from 'legacy/pages/SearchBar/reducer';
import ForgotPassword from 'legacy/pages/ForgotPassword/reducer';
import HiddenPosts from 'legacy/pages/HiddenPosts/reducer';
import Login from 'legacy/pages/Login/reducer';
import Notifications from 'legacy/pages/Notifications/reducer';
import PersonalProfile from 'legacy/pages/PersonalProfile/reducer';
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
};