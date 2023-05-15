import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { Button, Col, Layout, Menu, Row, Space, Tooltip, Badge } from 'antd';

// assets
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import CustomIcons from 'legacy/components/CustomIcons';
import { BeeMedLogo } from 'legacy/components/CustomIcons/logo';

// components
import ConditionalLink from 'legacy/components/ConditionalLink';
// global user
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';
import LanguageSelect from 'legacy/components/LanguageSelect';

import api, { setLanguageHeader } from 'engine/api/axiosAPI';

function HeaderLayout({
  notifications,
  user,
  chatMessageAmount,
  // actions
  notificationsAction,
  chatMessageAmountAction,
  logout,
  setAuthPopup,
  // default props
  className,
  nameMenuSplit,
  ...rest
}) {
  const childClassNames = classNames('layout-header', className);

  const { t, i18n } = useTranslation();

  setLanguageHeader(i18n.language);

  const location = useLocation();
  const currentPath = location.pathname.replace(/\//g, '');

  const showNew = localStorage.getItem('beemed_new_community');

  const hideNewEl = () => {
    localStorage.setItem('beemed_new_community', true);
  };

  const isUserIndustryPartner = user?.role === 'industry';

  const handleNotification = () => {
    if (user?._id) {
      notificationsAction();
    } else {
      setAuthPopup({ open: true });
    }
  };

  const handleMessageClick = () => {
    if (user?._id) {
      chatMessageAmountAction();
    } else {
      setAuthPopup({ open: true });
    }
  };

  const handleEcoursesClick = () => {
    if (user?._id) {
      api.users
        .getEcoursesLink({
          userId: user.userId,
        })
        .then(({ data }) => {
          window.location.href = data.result;
          return;
        });
    } else {
      window.location.href = 'https://beemed.com/ecourses';
    }
  };

  return (
    <Layout.Header className={childClassNames} {...rest}>
      <Row role="navigation">
        <Col
          xxl={user?._id ? 18 : 14}
          xl={user?._id ? 17 : 12}
          lg={user?._id ? 16 : 12}
          md={user?._id ? 14 : 9}
        >
          <Menu
            className="layout-header-menu"
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentPath]}
            activeKey={nameMenuSplit[1]}
            overflowedIndicator={
              <span>
                {t('common.more')} <DownOutlined />
              </span>
            }
          >
            <Menu.Item
              className={classNames(
                'logotype',
                isUserIndustryPartner && 'industry',
              )}
              key="/"
            >
              <Link
                to="/"
                className={classNames(
                  isUserIndustryPartner && 'industry--link',
                )}
              >
                {/* NOTE! this is for BEEM-674 - the logo looks blury on IOS safari */}
                <BeeMedLogo className="logoClient" />
                {/* <img src={LogoClient} alt="Beemed" className="logoClient" /> */}

                {isUserIndustryPartner && (
                  <span>{t('common.industryPartner')}</span>
                )}
              </Link>
            </Menu.Item>
            {isUserIndustryPartner ? (
              <>
                <Menu.Item key="community" onClick={hideNewEl}>
                  {!showNew && (
                    <span className="new-label">{t('common.new')}</span>
                  )}
                  <Link to="/community">{t('communities.community')}</Link>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item key="event">
                  <Link to="/event">{t('common.events')}</Link>
                </Menu.Item>
                <Menu.Item key="case">
                  <Link to="/case">{t('common.cases')}</Link>
                </Menu.Item>
                <Menu.Item key="article">
                  <Link to="/article">{t('common.articles')}</Link>
                </Menu.Item>
                <Menu.Item key="podcast">
                  <Link to="/podcast">{t('common.podcasts')}</Link>
                </Menu.Item>
                <Menu.Item key="community" onClick={hideNewEl}>
                  {!showNew && (
                    <span className="new-label">{t('common.new')}</span>
                  )}
                  <Link to="/community">{t('communities.communities')}</Link>
                </Menu.Item>
                <Menu.Item key="wiki">
                  <a
                    href="https://wiki.beemed.com/view/Main_Page"
                    target="_blank"
                  >
                    {t('common.wiki')}
                  </a>
                </Menu.Item>
                <Menu.Item key="course">
                  {/*todo service validation to beemed to get ecourses*/}
                  <a onClick={handleEcoursesClick}>{t('common.course')}</a>
                </Menu.Item>
                <Menu.Item key="partner">
                  <a
                    href="https://beemed.com/partnership/partners"
                    target={'_blank'}
                  >
                    {t('common.partners')}
                  </a>
                </Menu.Item>
                <Menu.Item key="help">
                  <a
                    href="https://beemedknowledgebase.stonly.com/kb/guide/en/beemed-frequently-asked-questions-g0mtDLrVsj/Steps/1651184"
                    target="_blank"
                  >
                    {t('common.help')}
                  </a>
                </Menu.Item>
              </>
            )}
          </Menu>
        </Col>
        <Col
          xxl={user?._id ? 6 : 10}
          xl={user?._id ? 7 : 12}
          lg={user?._id ? 8 : 12}
          md={user?._id ? 10 : 15}
          className="layout-header__right-side"
        >
          <Space size="middle">
            <div className="message-counter" onClick={handleMessageClick}>
              <Badge
                overflowCount={10}
                id="message-counter"
                style={{ pointerEvents: 'none' }}
                count={chatMessageAmount || 0}
              >
                <ConditionalLink
                  style={{ cursor: 'pointer', marginRight: '4px' }}
                  to="/chat/conversations"
                  condition={user?._id}
                >
                  <CustomIcons type="chat" />
                </ConditionalLink>
              </Badge>
            </div>
            {!isUserIndustryPartner && (
              <ConditionalLink
                className="search-bar"
                to={`/profile/${user._id}?tab=bookmarks`}
                style={{ cursor: 'pointer' }}
                condition={user?._id}
                onClick={() => setAuthPopup({ open: true })}
              >
                <CustomIcons type="bookmark-white" />
              </ConditionalLink>
            )}
            <div className="notification-counter" onClick={handleNotification}>
              <Badge
                overflowCount={10}
                id="notification-counter"
                style={{ pointerEvents: 'none' }}
                count={notifications && notifications.length}
              >
                <ConditionalLink
                  style={{ cursor: 'pointer' }}
                  to="/notifications"
                  condition={user?._id}
                >
                  <CustomIcons type="notifications-in-app" />
                </ConditionalLink>
              </Badge>
            </div>
            {!isUserIndustryPartner && (
              <Link className="search" to="/search">
                <SearchOutlined />
              </Link>
            )}
            <LanguageSelect />
            {user?._id && (
              <Tooltip placement="bottom" title={t('common.logout')}>
                <Button
                  type="text"
                  className="logout-bar"
                  onClick={() => logout()}
                >
                  <CustomIcons type="logout" />
                </Button>
              </Tooltip>
            )}
            {!user?._id && (
              <div className="action-buttons">
                <Link className="signup" to="/register">
                  {t('common.signUp')}
                </Link>
                <Link className="login" to="/login">
                  {t('common.login')}
                </Link>
              </div>
            )}
          </Space>
        </Col>
      </Row>
    </Layout.Header>
  );
}

HeaderLayout.propTypes = {
  notificationsAction: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default compose(
  memo,
  withUser,
  withAuthPopup,
)(HeaderLayout);
