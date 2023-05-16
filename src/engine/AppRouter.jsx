import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { routes } from 'engine/routes';
import { history } from 'store/store.new';

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
import MainLayout from 'layouts/MainLayout/MainLayout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.main} element={<MainLayout />}>
          <Route path={routes.case.baseUrl} element={<CaseOverview />} />
          <Route path={routes.case.detail} element={<CaseDetail />} />
          <Route path={routes.podcast.baseUrl} element={<PodcastsOverview />} />
          <Route path={routes.podcast.detail} element={<PodcastDetail />} />
          <Route path={routes.event.baseUrl} element={<EventOverview />} />
          <Route path={routes.event.detail} element={<EventDetail />} />
          <Route path={routes.article.baseUrl} element={<ArticlesOverview />} />
          <Route path={routes.article.detail} element={<ArticleDetail />} />
          <Route
            path={routes.community.baseUrl}
            element={<CommunitiesOverview />}
          />
          <Route path={routes.community.detail} element={<CommunityDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
