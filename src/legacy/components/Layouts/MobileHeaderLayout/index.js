/**
 *
 * MobileHeaderLayout
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { Badge } from 'antd';
import { Drawer, Icon, NavBar } from 'antd-mobile';

// assets
// import LogoClient from 'images/logo.svg';
import CustomIcons from 'legacy/components/CustomIcons';
import { BeeMedLogo } from 'legacy/components/CustomIcons/logo';

// components
import UserAvatar from 'legacy/components/UserAvatar';

// global user
import { withUser } from 'engine/context/User.context';
import SideBarMenu from '../SideBarMenu';

import LanguageSelect from 'legacy/components/LanguageSelect';
import { setLanguageHeader } from 'engine/api/axiosAPI';

function MobileHeaderLayout({
  header,
  user,
  notifications,
  isOpen,
  chatMessageAmount,
  // actions
  setDrawer,
  notificationsAction,
  chatMessageAmountAction,
  logout,
  openDrawer,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('layout-header-mobile', className);
  const { t, i18n } = useTranslation();
  setLanguageHeader(i18n.language);
  const isUserIndustryPartner = user?.role === 'industry';

  return (
    <div className={childClassNames}>
      <NavBar
        className={classNames(
          'navbar-mobile',
          isUserIndustryPartner && 'industry-mobile',
          i18n.language === 'ar' && 'navbar-mobile--rtl',
        )}
        mode="dark"
        icon={
          <>
            <Link
              className={classNames(
                isUserIndustryPartner && 'industry-mobile--link',
                'header-logo',
              )}
              to="/"
            >
              {/* NOTE! this is for BEEM-674 - the logo looks blury on IOS safari */}
              <BeeMedLogo className="header-logo__image" />
              {/* <img
                src={LogoClient}
                alt="BeeMed"
                className="header-logo__image"
              /> */}
              {isUserIndustryPartner && (
                <span>{t('common.industryPartner')}</span>
              )}
            </Link>
            {/* {isUserIndustryPartner && (
              <Typography.Text className="industry-community">
                Community
              </Typography.Text>
            )} */}
          </>
        }
        rightContent={
          user?._id
            ? [
                <div
                  key="header-notifications"
                  className="header-notifications"
                >
                  <div
                    className="message-counter"
                    onClick={chatMessageAmountAction}
                  >
                    <Badge
                      overflowCount={10}
                      id="message-counter"
                      style={{ pointerEvents: 'none' }}
                      count={chatMessageAmount || 0}
                    >
                      <Link className="" to={`/chat/conversations`}>
                        <CustomIcons type="chat" />
                      </Link>
                    </Badge>
                  </div>

                  <div
                    className="notification-counter"
                    onClick={notificationsAction}
                  >
                    <Badge
                      overflowCount={10}
                      id="notification-counter"
                      style={{ pointerEvents: 'none' }}
                      count={notifications && notifications.length}
                    >
                      <Link className="search-bar" to="/notifications">
                        <CustomIcons type="notifications-in-app" />
                      </Link>
                    </Badge>
                  </div>
                </div>,
                !isUserIndustryPartner && (
                  <Link
                    to="/search"
                    key="header-search"
                    style={{ color: 'white' }}
                  >
                    <Icon key="search-icon" type="search" />
                  </Link>
                ),
                <LanguageSelect />,
                <span onClick={openDrawer}>
                  <UserAvatar width={30} height={30} user={user} />
                </span>,
              ]
            : [
                <LanguageSelect />,
                <div className="action-buttons">
                  <Link className="login" to="/login">
                    {t('common.login')}
                  </Link>
                  <Link className="signup" to="/register">
                    {t('common.signUp')}
                  </Link>
                </div>,
              ]
        }
      >
        {/*{header || (*/}
        {/*  <Link className="header-logo" to="/">*/}
        {/*    <img src={LogoClient} alt="BeeMed" className="header-logo__image" />*/}
        {/*  </Link>*/}
        {/*)}*/}
      </NavBar>
      <Drawer
        className="tcf-mobile-drawer"
        style={{
          minHeight: document.documentElement.clientHeight,
        }}
        enableDragHandle
        sidebar={
          <SideBarMenu setDrawer={setDrawer} user={user} logout={logout} />
        }
        open={isOpen}
        onOpenChange={() => openDrawer()}
        position={'right'}
        touch={true}
        docked={false}
        children={false}
      />
    </div>
  );
}

MobileHeaderLayout.defaultProps = {};
MobileHeaderLayout.propTypes = {};

export default memo(withUser(MobileHeaderLayout));
