import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

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
  // actions here
  type,
  events,
  replayEvents,
  loadEvents,
  flushState,
}) {
  useInjectReducer({ key: 'profileSuggestions', reducer });
  useInjectSaga({ key: 'profileSuggestions', saga });

  const { t } = useTranslation();

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    loadEvents();
    return () => {
      // Clearing the state after unmounting a component
      flushState();
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

ProfileSuggestions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profileSuggestions: makeSelectProfileSuggestions(),
  events: makeSelectEvents(),
  replayEvents: makeSelectReplayEvents(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushState()),
    loadEvents: () => dispatch(loadEvents()),
    // loadProfileEvents: params => dispatch(loadProfileEvents()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ProfileSuggestions);
