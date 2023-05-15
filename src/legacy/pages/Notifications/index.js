import React, { memo, useEffect, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import {
  flushAction as flush,
  loadNotifications,
  updateNotification,
} from './actions';

// antd component
import { List } from 'antd';
// components
import NotificationsCard from 'legacy/components/NotificationsCard';

// contexts
import { withUser } from 'appContext/User.context';

export function Notifications({
  // props
  user,
  history,
  // default props
  className,
  // core
  state,
  dispatch,
}) {
  const { totalCount, notifications, noMore, loading } = state.SagaContainer;

  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (notifications.length === 0) {
      user._id && dispatch(loadNotifications(page, user._id));
    }
    return () => {
      // Clearing the state after unmounting a component
      dispatch(flushAction());
    };
  }, []);

  const onLoadMore = (page) => {
    setPage(page);
    dispatch(loadNotifications(page, user._id));
  };

  const notificationLinkHandler = (notif) => {
    if (notif?._id) {
      let category = notif?.post?.type;
      const postId = category ? notif?.post?._id : notif?.mention?._id;

      if (category === 'post') {
        category = 'case';
      }

      const baseLink = category ? '/' + category + '/detail' : '/profile';

      let link = notif?.link || `${baseLink}/${postId}`;

      history.push({
        pathname: link,
        search: '',
        hash: '',
        state: {
          goBackName: 'notifications.backToNotifications',
          currentPage: history.location.currentPage,
          notifications: true,
        },
      });
    }
  };

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  const notificationClickHandler = (item) => {
    if (item?._id && !item.clicked) {
      dispatch(
        updateNotification({
          ...item,
          clicked: true,
          seen: true,
        }),
      );
    }
    item?._id && notificationLinkHandler(item);
  };

  const handleInvitation = (data, item) => {
    data !== undefined &&
      dispatch(
        updateNotification({
          ...item,
          community: data.community,
          clicked: true,
          seen: true,
        }),
      );
  };

  // render function
  return (
    <div
      className={classNames(
        'main-side-content',
        i18n.language === 'ar' && 'main-side-content--rtl',
      )}
    >
      <Helmet>
        <title>{t('notifications.notifications')}</title>
        <meta name="description" content="Description of Notifications" />
      </Helmet>
      <div className="main-side-content__header notification">
        <h1>{t('notifications.notifications')}</h1>
      </div>
      <List
        className="notifications-list"
        itemLayout="vertical"
        dataSource={notifications}
        pagination={{
          onChange: (page) => {
            onLoadMore(page);
          },
          pageSize: 10,
          total: totalCount !== false ? totalCount : 1,
          responsive: true,
        }}
        renderItem={(item) => (
          <List.Item
            onClick={(e) => {
              e.preventDefault();
              notificationClickHandler(item);
            }}
            className={
              item.clicked ? 'checkedNotification' : 'uncheckedNotification'
            }
            key={item._id}
            extra={<h4>{moment(item.date_creation).fromNow()}</h4>}
          >
            <NotificationsCard
              show={!item.clicked}
              category={item.post?.type}
              title={item.title}
              body={item.content}
              post={item.post}
              mention={item.mention}
              community={item.community}
              isInvitation={item.isInvitation}
              invitationId={item.invitation}
              manageNotification={(data) => handleInvitation(data, item)}
            />
          </List.Item>
        )}
      />
      {/* </InfiniteScroll>*/}
      {noMore && <p>{t('common.noMore')}</p>}
    </div>
  );
}

export default compose(withRedux, memo, withUser)(Notifications);
