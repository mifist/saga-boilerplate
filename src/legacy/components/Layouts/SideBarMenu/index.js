import React, { memo } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// components
import { List } from 'antd-mobile';
import UserAvatar from '../../UserAvatar';
import { DeploymentUnitOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ConditionalLink from 'legacy/components/ConditionalLink';
import CustomIcons from '../../CustomIcons';
import api from 'engine/api/axiosAPI';

import { withAuthPopup } from 'engine/context/AuthPopup.context';

function SideBarMenu({
  // default props
  className,
  user,
  setDrawer,
  logout,
  setAuthPopup,
  ...rest
}) {
  const childClassNames = classNames('SideBarMenu-wrapper', className);
  //const { isMobile } = useDeviceDetect();

  const { t } = useTranslation();

  const hideNewEl = () => {
    localStorage.setItem('beemed_new_community', true);
  };
  const isUserIndustryPartner = user?.role === 'industry';

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
    <List className="mobile-sidebar-menu">
      <List.Item
        className="mobile-sidebar-menu__photo"
        key="profile"
        thumb={
          <ConditionalLink
            condition={!isUserIndustryPartner && user?._id}
            className="mobile-sidebar-menu__more"
            to={`/profile/${user._id}`}
            onClick={() => {
              setDrawer(false);
              setAuthPopup({ open: true });
            }}
          >
            <UserAvatar width={65} height={65} />
          </ConditionalLink>
        }
      >
        {!isUserIndustryPartner && user?._id && (
          <Link
            className="mobile-sidebar-menu__more"
            to={`/profile/${user._id}`}
            onClick={() => setDrawer(false)}
          >
            {t('common.viewMyProfile')}
          </Link>
        )}
      </List.Item>

      {!isUserIndustryPartner && (
        <>
          <List.Item className="mobile-sidebar-menu__item" key="search">
            <Link
              className="mobile-sidebar-menu__more"
              to="/search"
              onClick={() => setDrawer(false)}
            >
              <SearchOutlined />
              {t('common.search')}
            </Link>
          </List.Item>
          <List.Item className="mobile-sidebar-menu__item" key="bookmarks">
            <ConditionalLink
              className="mobile-sidebar-menu__more"
              to={`/profile/${user._id}?tab=bookmarks`}
              onClick={() => {
                setAuthPopup({ open: true });
                setDrawer(false);
              }}
              condition={user?._id}
            >
              <CustomIcons type="bookmark" className="bookmark" />
              {t('common.myBookmarks')}
            </ConditionalLink>
          </List.Item>
          <List.Item className="mobile-sidebar-menu__item" key="newsfeed">
            <Link
              className="mobile-sidebar-menu__more"
              to="/newsfeed"
              onClick={() => setDrawer(false)}
            >
              <CustomIcons type="feed" />
              {t('common.newsfeed')}
            </Link>
          </List.Item>
          <List.Item className="mobile-sidebar-menu__item" key="event">
            <Link
              className="mobile-sidebar-menu__more"
              to="/event"
              onClick={() => setDrawer(false)}
            >
              <CustomIcons type="naked" />
              {t('common.events')}
            </Link>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="case"
            onClick={hideNewEl}
          >
            <Link
              className="mobile-sidebar-menu__more"
              to="/case"
              onClick={() => setDrawer(false)}
            >
              <CustomIcons type="casestudy" />
              {t('common.cases')}
            </Link>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="community"
            onClick={hideNewEl}
          >
            <Link
              className="mobile-sidebar-menu__more"
              to="/community"
              onClick={() => setDrawer(false)}
            >
              <CustomIcons type="goup" />
              {t('communities.communities')}
            </Link>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="article"
            onClick={hideNewEl}
          >
            <Link
              className="mobile-sidebar-menu__more"
              to="/article"
              onClick={() => setDrawer(false)}
            >
              <CustomIcons type="document" />
              {t('common.articles')}
            </Link>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="podcast"
            onClick={hideNewEl}
          >
            <Link
              className="mobile-sidebar-menu__more"
              to="/podcast"
              onClick={() => setDrawer(false)}
            >
              <CustomIcons type="microphone" />
              {t('common.podcasts')}
            </Link>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="partners"
            onClick={hideNewEl}
          >
            <a
              className="mobile-sidebar-menu__more"
              style={{ fontSize: 14 }}
              href="https://beemed.com/partnership/partners"
              target="_blank"
            >
              <DeploymentUnitOutlined style={{ fontSize: 32 }} />
              {t('common.partners')}
            </a>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="wiki"
            onClick={hideNewEl}
          >
            <a
              className="mobile-sidebar-menu__more"
              style={{ fontSize: 14 }}
              href="https://wiki.beemed.com/view/Main_Page"
              target="_blank"
            >
              <CustomIcons type="wiki" />
              {t('common.wiki')}
            </a>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="course"
            onClick={hideNewEl}
          >
            <a
              className="mobile-sidebar-menu__more"
              style={{ fontSize: 14 }}
              onClick={handleEcoursesClick}
            >
              <CustomIcons type="course" />
              {t('common.course')}
            </a>
          </List.Item>
          <List.Item
            className="mobile-sidebar-menu__item"
            key="help"
            onClick={hideNewEl}
          >
            <a
              className="mobile-sidebar-menu__more"
              href="https://beemedknowledgebase.stonly.com/kb/guide/en/beemed-frequently-asked-questions-g0mtDLrVsj/Steps/1651184"
              target="_blank"
            >
              <CustomIcons type="help" />
              {t('common.help')}
            </a>
          </List.Item>
        </>
      )}

      <List.Item
        className="mobile-sidebar-menu__item"
        key="chat"
        onClick={() => {
          hideNewEl();
          setAuthPopup({ open: true });
        }}
      >
        <ConditionalLink
          condition={user?._id}
          className="mobile-sidebar-menu__more"
          to={`/chat/conversations`}
          onClick={() => setDrawer(false)}
        >
          <CustomIcons type="chat" />
          {t('common.chat')}
        </ConditionalLink>
      </List.Item>

      {user?._id && (
        <List.Item className="mobile-sidebar-menu__item logout" key="logout">
          <Button onClick={logout} className="mobile-sidebar-menu__more">
            <CustomIcons type="logout" />
            {t('common.logout')}
          </Button>
        </List.Item>
      )}
    </List>
  );
}

SideBarMenu.defaultProps = {};
SideBarMenu.propTypes = {};

export default memo(withAuthPopup(SideBarMenu));
