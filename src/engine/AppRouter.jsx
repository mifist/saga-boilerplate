import React from 'react';
import { Route, Routes, BrowserRouter, Outlet } from 'react-router-dom';

// routes
import { routes } from 'engine/routes';

// root layouts
import MainLayout from 'layouts/MainLayout/MainLayout';

// pages
import CaseOverview from 'legacy/pages/CaseOverview';
import CaseDetail from 'legacy/pages/CaseDetail';
import PodcastsOverview from 'legacy/pages/PodcastsOverview';
import PodcastDetail from 'legacy/pages/PodcastDetail';
import EventOverview from 'legacy/pages/EventOverview';
import EventDetail from 'legacy/pages/EventDetail';
import ArticlesOverview from 'legacy/pages/ArticlesOverview';
import ArticleDetail from 'legacy/pages/ArticleDetail';
import CommunitiesOverview from 'legacy/pages/CommunitiesOverview';
import CommunityDetail from 'legacy/pages/CommunityDetail';
import Login from 'legacy/pages/Login';
import Register from 'legacy/pages/Register';
import NewsFeed from 'legacy/pages/NewsFeed';


export default function AppRouter(props) {
  return (
    <BrowserRouter>
      <Routes>
      <Route path={routes.auth.login} element={<Login />} />
        <Route path={routes.auth.register} element={<Register />} />
        <Route path={routes.main} element={<MainLayout {...props} />}>
          <Route path={routes.case.baseUrl} element={<CaseOverview {...props} />} />
          <Route path={routes.case.detail} element={<CaseDetail {...props} />} />
          <Route path={routes.podcast.baseUrl} element={<PodcastsOverview {...props} />} />
          <Route path={routes.podcast.detail} element={<PodcastDetail {...props} />} />
          <Route path={routes.event.baseUrl} element={<EventOverview {...props} />} />
          <Route path={routes.event.detail} element={<EventDetail {...props} />} />
          <Route path={routes.article.baseUrl} element={<ArticlesOverview {...props} />} />
          <Route path={routes.article.detail} element={<ArticleDetail {...props} />} />
          <Route
            path={routes.community.baseUrl}
            element={<CommunitiesOverview {...props} />}
          />
          <Route path={routes.community.detail} element={<CommunityDetail {...props} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
