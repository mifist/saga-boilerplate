import React from 'react';

import { Route, Routes, Outlet, BrowserRouter } from 'react-router-dom';

import { routes } from 'engine/routes';
import { history } from 'store/store.new';

// pages
import Home from 'pages/Home';
import SagaContainer from 'pages/SagaContainer';
import { CaseOverview } from '../legacy/pages/CaseOverview';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CaseOverview />} exact />
        <Route path="/events" element={<SagaContainer />} exact />
        <Route path="/events/:eventID" element={<SagaContainer />} exact />
      </Routes>
    </BrowserRouter>
  );
}
