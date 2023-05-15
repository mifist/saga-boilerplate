import React, { memo, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

import {
  makeSelectMyEvents,
  makeSelectMyReplayEvents,
  makeSelectMyCommunities,
  makeSelectLoadingCommunities,
} from './selectors';
import { flushState, loadEvents, loadCommunities } from './actions';

// components
import SidebarCardList from 'legacy/components/Sidebar/SidebarCardList';
import SidebarAccordion from 'legacy/components/Sidebar/SidebarAccordion';

function PersonalSideBar({
  // actions here
  type,
  myEvents,
  myReplayEvents,
  myCommunities,
  loadingCommunities,
  loadEvents,
  loadCommunities,
  flushState,
}) {
  useInjectReducer({ key: 'personalSideBar', reducer });
  useInjectSaga({ key: 'personalSideBar', saga });

  const { t } = useTranslation();
  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    loadEvents(type);
    loadCommunities();

    // Anything in here is fired on component unmount.
    return () => {
      // Clearing the state after unmounting a component

      flushState();
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

PersonalSideBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  myEvents: makeSelectMyEvents(),
  myCommunities: makeSelectMyCommunities(),
  myReplayEvents: makeSelectMyReplayEvents(),
  loadingCommunities: makeSelectLoadingCommunities(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushState()),
    loadEvents: () => dispatch(loadEvents()),
    loadCommunities: () => dispatch(loadCommunities()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PersonalSideBar);
