import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Drawer, List, TabBar } from 'antd-mobile';

// assets
import CustomIcons from 'legacy/components/CustomIcons';
import { MenuOutlined } from '@ant-design/icons';

// global user
import { withUser } from 'engine/context/User.context';
import SideBarMenu from '../SideBarMenu';

function MobileBottomBar({
  // actions
  changeTab,
  // default props
  className,
  openDrawer,
  setDrawer,
  isOpen,
  user,
  logout,
  ...rest
}) {
  const childClassNames = classNames('fixed_nav_mobile', className);
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\//g, '');
  const defaultPath = currentPath || 'newsfeed';
  //console.log(currentPath);
  return (
    currentPath !== 'chat' && (
      <div className={childClassNames} {...rest}>
        <TabBar
          id="main-mobile-navigation"
          className="mobile-tab-bar"
          unselectedTintColor="#949494"
          tintColor="#005D72"
          barTintColor="white"
          hidden={false}
          tabBarPosition="bottom"
        >
          <TabBar.Item
            title={t('common.feed')}
            key="newsfeed"
            icon={<CustomIcons type="feed" />}
            selectedIcon={<CustomIcons type="feed-active" />}
            // badge={1}
            data-seed="logId"
            onPress={() => changeTab('newsfeed')}
            selected={currentPath.includes('newsfeed')}
            style={{ cursor: 'pointer' }}
            className={`${currentPath.includes('newsfeed') && 'selected-tab'}`}
          />
          <TabBar.Item
            icon={<CustomIcons type="naked" />}
            selectedIcon={<CustomIcons type="naked-active" />}
            title={t('common.events')}
            key="events"
            // badge="new"
            data-seed="event"
            onPress={() => changeTab('event')}
            selected={currentPath.includes('event')}
            style={{ cursor: 'pointer' }}
            className={`${currentPath.includes('event') && 'selected-tab'}`}
          />
          <TabBar.Item
            icon={<CustomIcons type="casestudy" />}
            selectedIcon={<CustomIcons type="casestudy-active" />}
            title={t('common.cases')}
            key="case"
            onPress={() => changeTab('case')}
            selected={currentPath.includes('case')}
            style={{ cursor: 'pointer' }}
            className={`${currentPath.includes('case') && 'selected-tab'}`}
          />
          <TabBar.Item
            icon={<CustomIcons type="goup" />}
            selectedIcon={<CustomIcons type="goup-active" />}
            title={t('communities.communities')}
            key="community"
            onPress={() => changeTab('community')}
            selected={currentPath.includes('community')}
            style={{ cursor: 'pointer' }}
            className={`${currentPath.includes('community') && 'selected-tab'}`}
          />
          <TabBar.Item
            icon={<MenuOutlined style={{ marginTop: 8 }} />}
            selectedIcon={<MenuOutlined style={{ marginTop: 8 }} />}
            title={t('common.menu')}
            key="menu"
            onPress={openDrawer}
            selected={currentPath.includes('menu')}
            style={{ cursor: 'pointer' }}
            className={`${currentPath.includes('menu') && 'selected-tab'}`}
          />
        </TabBar>
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
    )
  );
}

MobileBottomBar.propTypes = {
  changeTab: PropTypes.func.isRequired,
};

export default memo(withUser(MobileBottomBar));
