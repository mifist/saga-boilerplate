import React, { memo, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { CometChat } from '@cometchat-pro/chat';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import { resetNotifications } from './actions';

// antd component
import { Layout } from 'antd';
// legacy layouts
import {
  HeaderLayout, MobileBottomBar,
  UnauthorizedSidebar, MobileHeaderLayout,
} from 'legacy/layouts';
// components
import ProfileCard from 'legacy/components/Profile/ProfileCard';
import AuthenticationPopup from 'legacy/components/AuthenticationPopup';
// containers
import PersonalSideBar from 'legacy/containers/PersonalSideBar';

// contexts
import { withUser } from 'appContext/User.context';
// routes
import { routes } from 'engine/routes';
// utils
import { useDeviceDetect } from 'appHooks';


function MainLayout({
  // props
  user,
  // default props
  className,
  // core
  state,
  dispatch,
}) {
  const { freshNotifications } = state.MainLayout;

  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isMobileBrowser } = useDeviceDetect();

  const isUserIndustryPartner = user?.role === 'industry';

  const [chatMessageCount, setChatMessageCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const onBellClickHandler = () => {
    if (freshNotifications.length > 0) {
      dispatch(resetNotifications(user._id));
    }
  };

  const onBellChatClickHandler = () => {
    setChatMessageCount(0);
  };

  const logoutUser = () => {
    user.logoutUser();
    localStorage.removeItem('beemed_user');
    localStorage.removeItem('token');
    localStorage.removeItem('beemed_tour');
    localStorage.removeItem('beemed_new_community');
    localStorage.removeItem('beemed_tour_current');
    setDrawerOpened(false);
    CometChat.logout();
    navigate(routes.auth.login);
  };

  const onOpenChange = () => {
    setDrawerOpened(!drawerOpened);
  };

  const changeTabNavigation = (route) => {
    setDrawerOpened(false);
    navigate(`/${route}`);
  };

  return (
    <div
      className={classNames('app-body', showBanner && 'app-body-with-banner')}
    >
      <div className="app-main-layout">
        <Layout className="layout custom-mobile-layout">
          {!isMobile ? (
            <HeaderLayout
              notifications={freshNotifications}
              notificationsAction={onBellClickHandler}
              chatMessageAmount={chatMessageCount}
              chatMessageAmountAction={onBellChatClickHandler}
              logout={logoutUser}
            />
          ) : (
            <MobileHeaderLayout
              notifications={freshNotifications}
              notificationsAction={onBellClickHandler}
              chatMessageAmount={chatMessageCount}
              chatMessageAmountAction={onBellChatClickHandler}
              logout={logoutUser}
              openDrawer={onOpenChange}
              setDrawer={setDrawerOpened}
              isOpen={drawerOpened}
              header="BeeMed"
            />
          )}
          <Layout.Content
            className="layout-content main-layout-content"
            id="layout-content"
          >
            {!location.pathname.includes('detail') ? (
              <Layout
                style={{
                  padding: '42px 0 0 0',
                  backgroundColor: 'transparent',
                }}
              >
                {!isMobile &&
                  !isUserIndustryPartner &&
                  (user._id ? (
                    <Layout.Sider
                      width={{
                        sm: '230px',
                        md: '230px',
                        lg: '230px',
                        xl: '284px',
                      }}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <div style={{ position: 'sticky', top: 100 }}>
                        <ProfileCard />
                        <PersonalSideBar type="profile" />
                      </div>
                    </Layout.Sider>
                  ) : (
                    <Layout.Sider
                      style={{
                        backgroundColor: 'transparent',
                      }}
                      width={280}
                    >
                      <div style={{ position: 'sticky', top: 100 }}>
                        <UnauthorizedSidebar />
                      </div>
                    </Layout.Sider>
                  ))}
                <Layout.Content
                  style={{
                    minHeight: 280,
                    overflow: 'visible',
                    flex: '1',
                  }}
                >
                  <Outlet />
                </Layout.Content>
              </Layout>
            ) : (
              <Outlet />
            )}
          </Layout.Content>
        </Layout>
      </div>
      {isMobile &&
        !location.pathname.includes('chat') &&
        !isUserIndustryPartner && (
          <MobileBottomBar
            changeTab={changeTabNavigation}
            openDrawer={onOpenChange}
            setDrawer={setDrawerOpened}
            isOpen={drawerOpened}
            logout={logoutUser}
          />
        )}
      {!user?._id && Capacitor.platform === 'web' && <AuthenticationPopup />}
    </div>
  );
}

export default compose(memo, withRedux, withUser)(MainLayout);
