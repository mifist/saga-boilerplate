import React, { memo, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// HOC
import withRedux from 'HOC/withRedux';

import { flushState, loadEvents, loadCommunities } from './actions';

// components
import SidebarCardList from 'legacy/components/Sidebar/SidebarCardList';
import SidebarAccordion from 'legacy/components/Sidebar/SidebarAccordion';

function PersonalSideBar({
  // actions here
  type,
  // core
  state,
  dispatch,
}) {
  const { myEvents, myCommunities, myReplayEvents, loadingCommunities } =
    state.PersonalSideBar;

  const { t } = useTranslation();
  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    dispatch(loadEvents(type));
    dispatch(loadCommunities());

    // Anything in here is fired on component unmount.
    return () => {
      // Clearing the state after unmounting a component

      dispatch(flushState());
    };
  }, []);

  const myEventsOptions = {
    title: t('common.myEvents'),
    route: {
      to: '/event',
    },
  };
  const myCommunitiesOptions = {
    title: t('communities.myCommunities'),
    route: {
      to: '/community',
    },
  };

  return (
    <>
      {!loadingCommunities && myCommunities && (
        <SidebarAccordion
          key="communities-profile"
          options={myCommunitiesOptions}
        >
          <SidebarCardList isCommunity={true} options={myCommunities} />
        </SidebarAccordion>
      )}
      {myEvents && (
        <SidebarAccordion key="profile" options={myEventsOptions} type={type}>
          <SidebarCardList options={myEvents} />
          <SidebarCardList options={myReplayEvents} />
        </SidebarAccordion>
      )}
    </>
  );
}

export default compose(withRedux, memo)(PersonalSideBar);
