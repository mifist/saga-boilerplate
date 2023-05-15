import React, { memo, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

// HOC
import withRedux from 'HOC/withRedux';

import { flushState, loadEvents } from './actions';
import {
  makeSelectEvents,
  makeSelectProfileSuggestions,
  makeSelectReplayEvents,
} from './selectors';

// components
import SidebarCardList from 'legacy/components/Sidebar/SidebarCardList';
import SidebarAccordion from 'legacy/components/Sidebar/SidebarAccordion';

function ProfileSuggestions({
  // props
  type,
  // core
  state,
  dispatch
}) {
  const { 
    profileSuggestions,
    events,
    replayEvents,
  } = state.ProfileSuggestions;

  const { t } = useTranslation();

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    dispatch(loadEvents());
    return () => {
      // Clearing the state after unmounting a component
      dispatch(flushState());
    };
  }, []);

  const eventsOptions = {
    title: t('common.suggestions'),
    route: {
      to: '/event',
    },
  };
  return (
    <>
      <SidebarAccordion key="external" options={eventsOptions} type={type}>
        <SidebarCardList options={events} />
        <SidebarCardList options={replayEvents} />
      </SidebarAccordion>
    </>
  );
}

export default compose(
  withRedux,
  memo,
)(ProfileSuggestions);
