import React, { memo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useDeviceDetect from 'utils/useDeviceDetect';
import classNames from 'classnames';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import HeaderLayout from 'legacy/components/Layouts/HeaderLayout';
import MobileHeaderLayout from 'legacy/components/Layouts/MobileHeaderLayout';
import ProfileCard from 'legacy/components/Profile/ProfileCard';
import PersonalSideBar from 'legacy/containers/PersonalSideBar';
import UnauthorizedSidebar from 'legacy/components/Layouts/UnauthorizedSidebar';
import AuthenticationPopup from 'legacy/components/AuthenticationPopup';
import MobileBottomBar from 'legacy/components/Layouts/MobileBottomBar';

import { resetNotifications } from './actions';
import { withUser } from 'appContext/User.context';
import { CometChat } from '@cometchat-pro/chat';
import { routes } from 'engine/routes';
import './style.scss';

function MainLayout({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { freshNotifications } = useSelector((state) => state.MainLayout);

  const isUserIndustryPartner = user?.role === 'industry';
  const [chatMessageCount, setChatMessageCount] = useState(0);

  const [showBanner, setShowBanner] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const { isMobile, isMobileBrowser } = useDeviceDetect();

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

export default memo(withUser(MainLayout));
