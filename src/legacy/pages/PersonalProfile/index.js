/**
 *
 * PersonalProfile
 *
 */
import React, { useEffect, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { camelCase } from 'lodash';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import { flushState, loadProfile } from './actions';

// assets
import CustomIcons from 'legacy/components/CustomIcons';

// antd component
import { Layout, Col, Row, Button, Spin, notification } from 'antd';
// components
import UserAvatar from 'legacy/components/UserAvatar';
import LinkWrapper from 'legacy/components/LinkWrapper';
import ChatButton from 'legacy/components/ChatButton';
import TabsTcf from 'legacy/components/TabsTcf';
import ProfileSectionWrapper from 'legacy/components/Profile/ProfileSectionWrapper';
import Badge from 'legacy/components/Badge';
// widgets
import WidgetWrapper from 'legacy/components/Widgets/WidgetWrapper';
import UserCredentialsWidget from 'legacy/components/Widgets/UserCredentialsWidget';
import { ReportPopup } from 'legacy/components/ReportPopup';
// inner components
import RenderTab from './RenderTab';

// contexts
import { withUser } from 'appContext/User.context';
// utils
import api, { setAuthorizationHeader } from 'appAPI/axiosAPI';
import {
  getUrlVars,
  makeSearchQueryParams,
  getEmployment,
} from 'utils/generalHelper';
import { specialities, anatomies } from 'utils/categoryHelper';
// hooks
import useDeviceDetect from 'appHooks/useDeviceDetect';

export function PersonalProfilePage({
  // props
  history,
  user,
  // default props
  className,
  // core
  state,
  dispatch,
}) {
  const { profileData } = state.PersonalProfilePage;

  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const { id: initialId } = useParams();
  const urlVars = getUrlVars();

  const [activeTab, setActiveTab] = useState(urlVars?.tab || 'cases');

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    initialId && dispatch(loadProfile(initialId));
  }, [initialId]);

  // Clearing the state after unmounting a component
  useEffect(() => {
    return () => {
      // Anything in here is fired on component unmount.
      dispatch(flushState());
    };
  }, []);

  // Change active tab
  useEffect(() => {
    const search = urlVars?.tab;
    if (search !== null && search !== activeTab) {
      setActiveTab(search);
      history.replace({
        pathname: window.location.pathname,
        search: makeSearchQueryParams({
          tab: search,
        }),
      });
    }
  }, [urlVars?.tab, activeTab]);

  const {
    profileBookmarks,
    profileComments,
    profileCases,
    profilePosts,
    profile,
    loading,
    error,
    isReady,
  } = profileData;

  const local = localStorage.getItem('beemed_user');
  const json = JSON.parse(local);
  setAuthorizationHeader(json?.token);

  const [reportPopupOpened, setReportPopupOpened] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // This id is not associated with one profile, redirect
  useEffect(() => {
    if (error) {
      console.log({ error });
      // history.push('/');
    }
  }, [error]);

  const tabChangedHandle = (key, prevKey) => {
    if (key == 'cases') {
      // onLoadFeeds(initialId, 1, filter, 'case');
    } else if (key == 'feed') {
      // onLoadFeeds(initialId, 1, filter);
    }
    setActiveTab(key);
    history.replace({
      pathname: window.location.pathname,
      search: makeSearchQueryParams({
        tab: key,
      }),
    });
  };

  // const isFollower = user.followers.some(e => e === profile._id);

  /*   const onClickFollow = e => {
    e.preventDefault();

    if (isFollower) {
      user.onRemoveFollowers(profile._id);
    } else {
      user.onPushFollowers(profile._id);
    }
  }; */

  const renderInfos = () => (
    <div className="profile-tags">
      {profile.credential?.qualifications?.map((item, i) => (
        <span key={i} className="qualifications">
          {t(`common.qualifications-${camelCase(item)}`)}
        </span>
      ))}
      {profile.credential?.domains?.map((item, i) => (
        <span key={i} className="domains">
          {t(
            `common.specialities-${camelCase(
              Number.isNaN(Number(item))
                ? item
                : specialities.find((sp) => sp.value === item)?.label,
            )}`,
          )}
        </span>
      ))}
      {profile.credential?.anatomies?.map((item, i) => (
        <span key={i} className="anatomies">
          {t(
            `common.anatomies-${camelCase(
              Number.isNaN(Number(item))
                ? item
                : anatomies.find((anatomy) => anatomy.value === item)?.label,
            )}`,
          )}
        </span>
      ))}
    </div>
  );

  const hackRender = (tab, url, array) => {
    return (
      <RenderTab
        renderTab={tab}
        activeTab={activeTab || 'cases'}
        url={url}
        arrayData={array}
      />
    );
  };

  const isUserProfile = () => {
    if (user?._id === profile?._id) {
      return true;
    } else {
      return false;
    }
  };

  const profileTabs = [
    {
      key: 'cases',
      name: t('common.cases'),
      content: hackRender('cases', 'case', profileCases),
    },
    {
      key: 'posts',
      name: t('common.posts'),
      content: hackRender('posts', 'post', profilePosts),
    },
    {
      key: 'comments',
      name: t('profile.comments'),
      content: hackRender('comments', 'comment', profileComments),
    },
    {
      key: 'events',
      name: t('common.events'),
      content: hackRender('events', 'event'),
    },
    {
      key: 'bookmarks',
      name: t('profile.bookmarks'),
      content: hackRender('bookmarks', 'bookmark', profileBookmarks),
    },
    /* {
      key: 'followers',
      name: 'Followers',
      content: hackRender('followers', 'follower'),
    }, */
  ];

  const profileTabs2 = [
    {
      key: 'cases',
      name: t('common.cases'),
      content: hackRender('cases', 'case', profileCases),
    },
    {
      key: 'posts',
      name: t('common.posts'),
      content: hackRender('posts', 'post', profilePosts),
    },
    {
      key: 'comments',
      name: t('profile.comments'),
      content: hackRender('comments', 'comment', profileComments),
    },
    {
      key: 'events',
      name: t('common.events'),
      content: hackRender('events', 'event'),
    },
  ];

  // if (profileData && )
  if (profileData && !loading && profileData.profile.role === 'industry') {
    history.push('/');
    return null;
  }

  const { isEmployee, industryName } = getEmployment(profileData.profile);

  const handleReportSubmit = (values) => {
    setReportLoading(true);

    api.users
      .reportUser({
        userEmail: user?.email,
        userFullName:
          user?.description?.firstname + ' ' + user?.description?.lastname,
        reportType: values.reportType,
        reportContent: values.reportContent,
        date: moment().format('YYYY-MM-DD'),
        userId: user?._id,
        reportedUserId: profile._id,
        reportedUserName:
          profile?.description?.firstname +
          ' ' +
          profile?.description?.lastname,
      })
      .then((response) => {
        if (response.status === 200) {
          notification.success({
            message: response.data.data,
          });
        } else if (response.status === 400) {
          notification.error({
            message: response.data.data,
          });
        }
        setReportLoading(false);
        setReportPopupOpened(false);
      })
      .catch((error) => {
        notification.error({
          message: t('common.somethingWentWrong'),
        });
        setReportLoading(false);
        setReportPopupOpened(false);
      });
  };

  // render function
  return (
    <div>
      <Helmet>
        <title>{t('profile.profilePage')}</title>
        <meta name="description" content="Profile Page - BeeMed" />
      </Helmet>
      <Row gutter={[0, 30]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {profileData && !loading && (
          <Layout className="main-single-layout with-sidebar personal-profile">
            <Layout.Content className="main-single-content personal-profile">
              <Row className="main-single-content__header personal-profile">
                <Col xs={24}>
                  <ProfileSectionWrapper
                    key="profile-header"
                    className="profile-header"
                  >
                    {user._id === profile._id ? (
                      <LinkWrapper
                        type={'edit-profile'}
                        _id={user._id}
                        className={'ant-btn profile-header__edit'}
                        goBackName="profile.backToMyProfile"
                        extraParams={{ hash: '#Profile' }}
                      >
                        <CustomIcons type="edit" />
                        {t('profile.editMyProfile')}
                      </LinkWrapper>
                    ) : // <a
                    //   href={'#'}
                    //   onClick={onClickFollow}
                    //   className={`profile-header__follow ${
                    //     isFollower ? 'profile-follow' : 'profile-nofollow'
                    //   }`}
                    // >
                    //   <img src={isFollower ? Followed : Follow} />
                    //   {isFollower ? 'Followed' : 'Follow'}
                    // </a>
                    null}

                    <Row className="row-profile" gutter={[16, 16]}>
                      <Col lg={8}>
                        {isReady && !loading && (
                          <UserAvatar
                            user={profile}
                            width={150}
                            height={150}
                            fontSize={24}
                          />
                        )}
                      </Col>
                      <Col lg={16}>
                        {loading && (
                          <Spin className="loading-preview" size="large" />
                        )}
                        {isReady && !loading && (
                          <>
                            <h2 className={'profile-header__title'}>
                              <span className="profile-header__title--fullname">
                                {/*{profile.credential.isDoctor && 'Dr.'}{' '}*/}
                                {profile?.description?.firstname}{' '}
                                {profile?.description?.lastname}
                              </span>

                              {isEmployee && (
                                <Badge
                                  title={t('communities.employeeOf', {
                                    industryName,
                                  })}
                                />
                              )}
                            </h2>
                            <div className={'profile-header__description'}>
                              {profile.description.company
                                ? t('profile.positionAndCompany', {
                                    position: profile.credential.title,
                                    companyName: profile.description.company,
                                  })
                                : profile.credential.title}
                            </div>
                            {/* <p>
                              {profile.address.city} {profile.address.country}
                            </p> */}
                            {renderInfos()}
                            <div className={'profile-info'}>
                              <ChatButton memberID={profile._id} />

                              {user._id !== profile._id && (
                                <>
                                  <Button
                                    onClick={() => setReportPopupOpened(true)}
                                  >
                                    {t('common.report')}
                                  </Button>
                                  <ReportPopup
                                    visible={reportPopupOpened}
                                    onClose={() => setReportPopupOpened(false)}
                                    onSubmit={handleReportSubmit}
                                    loading={reportLoading}
                                  />
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </ProfileSectionWrapper>

                  <ProfileSectionWrapper
                    key="profile-about"
                    className="profile-about"
                  >
                    <p>
                      <b>{t('profile.aboutMe')}</b>
                    </p>
                    {loading && (
                      <Spin className="loading-preview" size="large" />
                    )}
                    {isReady && !loading && (
                      <p>
                        {profile.description.description !== ''
                          ? profile.description.description
                          : t('profile.noDescriptionYet')}
                      </p>
                    )}
                  </ProfileSectionWrapper>
                </Col>
              </Row>
              <Row className="main-single-content__main personal-profile">
                <Col xs={24}>
                  <TabsTcf
                    tabsOptions={
                      isUserProfile() ? profileTabs || [] : profileTabs2
                    }
                    onChangeTab={tabChangedHandle}
                    activeKey={activeTab}
                    className="personal-profile-tabs"
                  />
                </Col>
              </Row>
            </Layout.Content>

            {!isMobile && (
              <Layout.Sider
                width={430}
                style={{ backgroundColor: 'transparent' }}
              >
                <WidgetWrapper mode="simple">
                  <UserCredentialsWidget userInfo={profile} />
                </WidgetWrapper>
              </Layout.Sider>
            )}
          </Layout>
        )}
      </Row>
    </div>
  );
}

export default compose(withRedux, withUser)(PersonalProfilePage);
