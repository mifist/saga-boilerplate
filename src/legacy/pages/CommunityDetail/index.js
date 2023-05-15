/**
 *
 * CommunityDetail
 *
 */
import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import { useParams, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import saga from './saga';
import reducer from './reducer';

import {
  selectCommunityDetailData,
  selectCommunityDetailLoading,
  selectCommunityDetailError,
  selectCommunityDetailDeleteSuccessful,
  selectCommunityDetailLoadingChange,
  // tags
  selectCommunityTags,
  selectCommunityDetailTags,
  // media
  selectCommunityMedia,
  selectCommunityMediaLoading,
  // feeds
  selectCommunityFeeds,
  selectCommunityFeedsLoading,
  selectCommunityFeedsNoMore,
  // other
  selectCommunityPage,
  makeSelectReportPopup,
  makeSelectReportLoading,
} from './selectors';
import {
  flushStateCommunityDetail,
  loadCommunityDetail,
  changeCommunityDetail,
  deleteCommunityDetail,
  // tags
  loadCommunityTags,
  loadCommunityDetailTags,
  // media
  uploadCommunityMedia,
  // publication
  postPublication,
  // feeds
  loadCommunityFeed,
  setReportPopup as setReportPopupAction,
  reportPost as reportPostAction,
} from './actions';

// antd component
import { Col, Layout, Row, Spin } from 'antd';

// components
import TabsTcf from 'legacy/components/TabsTcf';
// widgets components
import WidgetWrapper from 'legacy/components/Widgets/WidgetWrapper';
import AboutCommunityWidget from 'legacy/components/Widgets/AboutCommunityWidget';
import PopularTagsWidget from 'legacy/components/Widgets/PopularTagsWidget';
import RulesWidget from 'legacy/components/Widgets/RulesWidget';
import MembersListWidget from 'legacy/components/Widgets/MembersListWidget';

// community components
import CommunityPreHeader from 'legacy/components/Community/CommunityPreHeader';
import CommunityHeader from 'legacy/components/Community/CommunityHeader';
import CommunityFeeds from 'legacy/components/Community/CommunityFeeds';
import CommunityWelcome from 'legacy/components/Community/CommunityWelcome';
// community containers
import MembersTab from 'legacy/containers/Community/MembersTab';

// contexts
import { withUser } from 'appContext/User.context';
// helper
import useDeviceDetect from 'appHooks/useDeviceDetect';
import {
  getUrlVars,
  makeSearchQueryParams,
  getObjId,
} from 'utils/generalHelper';

export function CommunityDetail({
  // main data
  communityDetailData,
  uploadMedia,
  loadingMedia,
  // feed
  communityFeeds,
  loadingFeeds,
  noMore,
  page,
  onLoadFeeds,
  // tags data
  communityTags,
  communityPopularTags,
  onLoadTags,
  onLoadPopularTags,
  // states
  user,
  history,
  deleteSuccessful,
  error,
  loading,
  loadingChange,
  // actions
  onLoadDetail,
  onChangeAction,
  onDeleteAction,
  onUploadMedia,
  onPostPublication,
  flushState,
  reportPost,
  reportPopup,
  reportLoading,
  setReportPopup,
}) {
  useInjectReducer({ key: 'communityDetail', reducer });
  useInjectSaga({ key: 'communityDetail', saga });

  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const { id: initialId } = useParams();
  const urlVars = getUrlVars();

  const initFilter = {
    sort: 'newest',
  };
  const [filter, setFilter] = useState(initFilter);
  const [filterTag, setFilterTag] = useState('');

  const [members, setMembers] = useState(false);
  const [activeRuleKey, setActiveRuleKey] = useState('');

  const [activeTab, setActiveTab] = useState(urlVars?.tab || '');
  const [rules, setRules] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const canEdit = useCallback(() => {
    const userId = getObjId(user);
    const isAdmin =
      communityDetailData?.admins &&
      communityDetailData?.admins.find((el) => getObjId(el) == userId);
    return isAdmin;
  }, [communityDetailData, user]);

  const isModerator = useCallback(() => {
    const userId = getObjId(user);
    const isModerator =
      communityDetailData?.moderators &&
      communityDetailData?.moderators.find((el) => getObjId(el) == userId);
    return isModerator;
  }, [communityDetailData, user]);

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    // --> main code here
    if (
      (user?.role !== 'industry' && initialId !== 'new' && initialId) ||
      (user?.role == 'industry' &&
        initialId !== 'new' &&
        initialId == getObjId(user?.employment?.industryCommunity))
    ) {
      onLoadDetail(initialId);
      onLoadTags(initialId);
      onLoadPopularTags(initialId);
      onLoadFeeds(initialId, page, filter);
    }

    if (
      user?.role == 'industry' &&
      initialId != getObjId(user?.employment?.industryCommunity)
    ) {
      getObjId(user?.employment?.industryCommunity) &&
        (history.push(
          `/community/detail/${getObjId(user?.employment?.industryCommunity)}`,
        ),
        window.location.reload());
    }

    // Anything in here is fired on component unmount.
    return () => {
      // Clearing the state after unmounting a component
      flushState();
    };
  }, []);

  // Change active tab
  useEffect(() => {
    const search = urlVars?.tab;
    const page = urlVars?.page || 1;
    const panel = urlVars?.panel || '3';
    if (search !== null && search !== activeTab) {
      setActiveTab(search);
      history.replace({
        pathname: window.location.pathname,
        search: makeSearchQueryParams({
          tab: search,
          page: page,
          panel: panel,
        }),
      });
    }
  }, [urlVars?.tab, activeTab]);

  useEffect(() => {
    if (communityDetailData) {
      setMembers({
        admins: communityDetailData?.admins,
        moderators: communityDetailData?.moderators,
        members: communityDetailData?.members,
      });

      if (communityDetailData?.rules) {
        // array => object => string
        setRules(communityDetailData?.rules);
      }
      if (communityDetailData?.requests_join) {
        setJoinRequests(communityDetailData?.requests_join);
      }
      if (communityDetailData.invitations) {
        setInvitations(communityDetailData.invitations);
      }
    }
  }, [communityDetailData]);

  // Redirect on successful post deletion
  useEffect(() => {
    if (deleteSuccessful) {
      flushState();
      history.goBack();
    }
  }, [deleteSuccessful]); // Redirect on successful post deletion

  // on authorization error
  useEffect(() => {
    if (error.message == 'Unauthorized') {
      history.push('/community');
    }
  }, [error]);

  // Open Tab from side Widgets
  const openInsideTab = (tabKey, ruleId = '') => {
    setActiveTab(tabKey);
    history.replace({
      pathname: window.location.pathname,
      search: makeSearchQueryParams({
        tab: tabKey,
      }),
    });
    ruleId && setActiveRuleKey(ruleId);
  };

  const tabChangedHandle = (key, prevKey) => {
    if (key == 'cases') {
      onLoadFeeds(initialId, 1, filter, 'case');
    } else if (key == 'feed') {
      onLoadFeeds(initialId, 1, filter);
    }
    const page = urlVars?.page || 1;
    const panel = urlVars?.panel || '3';
    setActiveTab(key);
    history.replace({
      pathname: window.location.pathname,
      search: makeSearchQueryParams({
        tab: key,
        page: page,
        panel: panel,
      }),
    });
  };

  const onChangeRules = (newRulesList) => {
    // const isEquals = arraysObjEqual(communityDetailData?.rules, newRulesList);
    const newCommunityDeteilData = {
      ...communityDetailData,
      rules: newRulesList,
    };
    newRulesList && onChangeAction(newCommunityDeteilData);
  };

  const onChangeCommunity = (communityData) => {
    const newCommunityDeteilData = {
      ...communityDetailData,
      ...communityData,
    };
    onChangeAction(newCommunityDeteilData);
  };

  const changeFeedsFilter = (filter) => {
    setFilter(filter);
  };

  const feedsOption = {
    feeds: communityFeeds,
    page,
    loading: loadingFeeds,
    noMore,

    currentTag: filterTag,
    tags: communityTags,

    changeFilter: changeFeedsFilter,
    onPost: onPostPublication,
    onLoad: onLoadFeeds,
    media: uploadMedia,
    onUploadMedia,
  };

  const communityTabs = [
    {
      key: 'feed',
      name: t('communities.communityFeed'),
      content: (
        <CommunityFeeds
          reportPopup={reportPopup}
          setReportPopup={setReportPopup}
          reportLoading={reportLoading}
          reportPost={reportPost}
          {...feedsOption}
        />
      ),
    },
    {
      key: 'cases',
      name: t('common.cases'),
      content: (
        <CommunityFeeds
          reportPopup={reportPopup}
          setReportPopup={setReportPopup}
          reportLoading={reportLoading}
          reportPost={reportPost}
          {...feedsOption}
          type="case"
        />
      ),
    },
    {
      key: 'about',
      name: t('common.about'),
      content: (
        <AboutCommunityWidget
          mode="component"
          communityInfo={communityDetailData}
          onChangeCommunity={onChangeCommunity}
        />
      ),
    },
    {
      key: 'rules',
      name: t('common.rules'),
      content: (
        <RulesWidget
          mode="component"
          defaultKey={activeRuleKey}
          rules={rules}
          members={members}
          onChangeRules={onChangeRules}
        />
      ),
    },
    {
      key: 'members',
      name: t('communities.members'),
      content: (
        <MembersTab
          joinRequests={joinRequests}
          updateRequests={setJoinRequests}
          members={members}
          updateMembers={setMembers}
          updateInvitations={setInvitations}
          invitations={invitations}
          communityData={communityDetailData}
          showMembersAmount={
            canEdit() || isModerator() || communityDetailData?.showMembersAmount
          }
        />
      ),
    },
  ];

  // render function
  return (
    <div className="main-full-content">
      <Helmet>
        <title>{t('communities.communityDetails')}</title>
        <meta name="description" content="Description of Community Details" />
      </Helmet>
      <Row gutter={[0, 30]}>
        {!initialId ||
        (initialId &&
          user?.employment &&
          user?.role === 'industry' &&
          (!user?.employment?.industryCommunity ||
            initialId !== getObjId(user?.employment?.industryCommunity))) ? (
          <CommunityWelcome
            className="empty-welcome-info"
            showDescription={false}
          />
        ) : (
          <>
            {loading && <Spin className="loading-preview" size="large" />}
            {communityDetailData && !loading && (
              <Layout className="main-single-layout with-sidebar community">
                <Layout.Content className="main-single-content community">
                  <Row className="main-single-content__header community">
                    <Col xs={24}>
                      <CommunityPreHeader
                        communityInfo={communityDetailData}
                        media={uploadMedia}
                        loading={loadingMedia}
                        onChangeHeader={onChangeCommunity}
                        onMedia={onUploadMedia}
                      />
                      <CommunityHeader
                        communityInfo={communityDetailData}
                        loading={loadingChange}
                        onChangeHeader={onChangeCommunity}
                      />
                    </Col>
                  </Row>
                  <Row className="main-single-content__main community">
                    <Col xs={24}>
                      <TabsTcf
                        tabsOptions={communityTabs}
                        onChangeTab={tabChangedHandle}
                        activeKey={activeTab}
                      />
                    </Col>
                  </Row>
                </Layout.Content>

                {!isMobile && (
                  <Layout.Sider
                    width={294}
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <WidgetWrapper title={t('communities.aboutTheCommunity')}>
                      <AboutCommunityWidget
                        communityInfo={communityDetailData}
                        openTab={openInsideTab}
                      />
                    </WidgetWrapper>

                    {communityPopularTags && (
                      <WidgetWrapper
                        title={t('communities.popularCommunityTags')}
                      >
                        <PopularTagsWidget
                          tags={communityPopularTags}
                          setPopulatTag={setFilterTag}
                          openTab={openInsideTab}
                        />
                      </WidgetWrapper>
                    )}

                    {communityDetailData?.rules && (
                      <WidgetWrapper
                        title={t('communities.communityRules')}
                        className="rules"
                      >
                        <RulesWidget
                          openTab={openInsideTab}
                          rules={communityDetailData?.rules}
                        />
                      </WidgetWrapper>
                    )}

                    {members && (
                      <WidgetWrapper
                        title={t('communities.members')}
                        className="members"
                      >
                        <MembersListWidget
                          members={members}
                          openTab={openInsideTab}
                          community={communityDetailData}
                          communityType={communityDetailData?.private}
                          showMembersAmount={
                            canEdit() ||
                            isModerator() ||
                            communityDetailData?.showMembersAmount
                          }
                        />
                      </WidgetWrapper>
                    )}
                  </Layout.Sider>
                )}
              </Layout>
            )}
            {!communityDetailData && !loading && (
              <CommunityWelcome
                className="empty-welcome-info"
                showDescription={false}
              />
            )}
          </>
        )}
      </Row>
    </div>
  );
}

CommunityDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  deleteSuccessful: PropTypes.bool,
  onLoadDetail: PropTypes.func.isRequired,
  onChangeAction: PropTypes.func,
  onDeleteAction: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: selectCommunityDetailLoading(),
  error: selectCommunityDetailError(),
  deleteSuccessful: selectCommunityDetailDeleteSuccessful(),
  communityDetailData: selectCommunityDetailData(),
  communityPopularTags: selectCommunityDetailTags(),
  loadingChange: selectCommunityDetailLoadingChange(),
  // other
  communityTags: selectCommunityTags(),
  // feeds
  communityFeeds: selectCommunityFeeds(),
  loadingFeeds: selectCommunityFeedsLoading(),
  noMore: selectCommunityFeedsNoMore(),
  page: selectCommunityPage(),
  // media
  uploadMedia: selectCommunityMedia(),
  loadingMedia: selectCommunityMediaLoading(),
  reportPopup: makeSelectReportPopup(),
  reportLoading: makeSelectReportLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushStateCommunityDetail()),
    onLoadDetail: (id) => dispatch(loadCommunityDetail(id)),
    onChangeAction: (data) => dispatch(changeCommunityDetail(data)),
    onDeleteAction: (id) => dispatch(deleteCommunityDetail(id)),
    onLoadTags: (id) => dispatch(loadCommunityTags(id)),
    onLoadPopularTags: (id) => dispatch(loadCommunityDetailTags(id)),
    onUploadMedia: (media) => dispatch(uploadCommunityMedia(media)),
    onLoadFeeds: (id, page, filter, entity = 'post') =>
      dispatch(loadCommunityFeed(id, page, filter, entity)),
    onPostPublication: (publication) => dispatch(postPublication(publication)),
    setReportPopup: (data) => dispatch(setReportPopupAction(data)),
    reportPost: (data) => dispatch(reportPostAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  withRouter,
  withUser,
)(CommunityDetail);
