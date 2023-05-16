/**
 *
 * CommunityDetail
 *
 */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';

import {
  // media
  onUploadMedia,
  // publication
  onPostPublication,
  // feeds
  onLoadFeeds,
  loadCommunityTags,
  loadCommunityDetailTags,
  loadCommunityDetail,
  setReportPopup,
  reportPost,
  flushState,
  loadCommunityFeed,
} from './actions';

// antd component
import { Col, Layout, Row, Spin } from 'antd';
// components
import TabsTcf from 'legacy/components/TabsTcf';
// widgets components
import {
  WidgetWrapper,
  AboutCommunityWidget,
  PopularTagsWidget,
  RulesWidget,
  MembersListWidget,
} from 'legacy/components/Widgets';
// community components
import {
  CommunityPreHeader,
  CommunityHeader,
  CommunityFeeds,
  CommunityWelcome,
} from 'legacy/components/Community';
// community containers
import MembersTab from 'legacy/containers/Community/MembersTab';

// contexts
import { withUser } from 'appContext/User.context';
// hooks
import useDeviceDetect from 'appHooks/useDeviceDetect';
// utils
import {
  getUrlVars,
  makeSearchQueryParams,
  getObjId,
} from 'utils/generalHelper';

export function CommunityDetail({
  // props
  user,
  // default props
  className,
  // core
  state,
  dispatch,
}) {
  const {
    loading,
    error,
    deleteSuccessful,
    communityDetailData,
    communityPopularTags,
    loadingChange,
    communityTags,
    communityFeeds,
    loadingFeeds,
    noMore,
    page,
    uploadMedia,
    loadingMedia,
    reportPopup,
    reportLoading,
  } = state.CommunityDetail;

  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const { id: initialId } = useParams();
  const urlVars = getUrlVars();
  const navigate = useNavigate();

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
      dispatch(loadCommunityDetail(initialId));
      dispatch(loadCommunityTags(initialId));
      dispatch(loadCommunityDetailTags(initialId));
      dispatch(loadCommunityFeed(initialId, page, filter));
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
      dispatch(flushState());
    };
  }, []);

  // Change active tab
  useEffect(() => {
    const search = urlVars?.tab;
    const page = urlVars?.page || 1;
    const panel = urlVars?.panel || '3';
    if (search !== null && search !== activeTab) {
      setActiveTab(search);
      navigate({
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
      dispatch(flushState());
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
      dispatch(onLoadFeeds(initialId, 1, filter, 'case'));
    } else if (key == 'feed') {
      dispatch(onLoadFeeds(initialId, 1, filter));
    }
    const page = urlVars?.page || 1;
    const panel = urlVars?.panel || '3';
    setActiveTab(key);
    navigate({
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
    newRulesList && dispatch(onChangeAction(newCommunityDeteilData));
  };

  const onChangeCommunity = (communityData) => {
    const newCommunityDeteilData = {
      ...communityDetailData,
      ...communityData,
    };
    dispatch(onChangeAction(newCommunityDeteilData));
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
    onPost: (publication) => dispatch(onPostPublication(publication)),
    onLoad: (id, page, filter, entity = 'post') =>
      dispatch(onLoadFeeds(id, page, filter, entity)),
    media: uploadMedia,
    onUploadMedia: (media) => dispatch(onUploadMedia(media)),
  };

  const communityTabs = [
    {
      key: 'feed',
      name: t('communities.communityFeed'),
      content: (
        <CommunityFeeds
          reportPopup={reportPopup}
          setReportPopup={(data) => dispatch(setReportPopup(data))}
          reportLoading={reportLoading}
          reportPost={(data) => dispatch(reportPost(data))}
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
          setReportPopup={(data) => dispatch(setReportPopup(data))}
          reportLoading={reportLoading}
          reportPost={(data) => dispatch(reportPost(data))}
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
                        onMedia={(media) => dispatch(onUploadMedia(media))}
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
  loading: PropTypes.bool,
  deleteSuccessful: PropTypes.bool,
};

export default compose(withRedux, memo, withUser)(CommunityDetail);
