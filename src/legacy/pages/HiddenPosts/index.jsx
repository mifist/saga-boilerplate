import React, { useEffect, memo } from 'react';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';
// actions
import { flushState, loadHiddenPosts, unhidePost } from './actions';

// antd component
import { Table, Typography, Tooltip, Button } from 'antd';

// contexts
import { withUser } from 'appContext/User.context';
// utils
import { getBaseDomainOrigin } from 'utils/capacitorHelper';

const HiddenPosts = ({
  // props
  user,
  history,
  // default props
  className,
  // core
  state,
  dispatch,
}) => {
  const { hiddenPosts, loading } = state.HiddenPosts;

  const { t } = useTranslation();

  useEffect(() => {
    if (user.role === 'admin') {
      dispatch(loadHiddenPosts());
    } else {
      navigate('/');
    }

    return () => {
      dispatch(flushState());
    };
  }, []);

  return (
    <div className="hidden-posts">
      <Typography.Title level={3}>
        {t('hiddenPosts.hiddenPosts')}
      </Typography.Title>
      <Table
        loading={loading}
        pagination={{
          pageSize: 20,
        }}
        columns={[
          {
            title: t('hiddenPosts.id'),
            dataIndex: '_id',
            key: '_id',
            width: 230,
          },
          {
            title: t('hiddenPosts.type'),
            dataIndex: 'type',
            key: 'type',
            width: 100,
          },
          {
            title: t('hiddenPosts.title'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            ),
          },
          {
            title: t('hiddenPosts.content'),
            dataIndex: 'content',
            key: 'content',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            ),
          },
          {
            title: t('hiddenPosts.link'),
            dataIndex: 'link',
            key: 'link',
            ellipsis: {
              showTitle: false,
            },
            render: (text, record) => {
              const url = `${getBaseDomainOrigin()}/${
                record.type === 'post' ? 'case' : record.type
              }/detail/${record._id}`;

              return (
                <Tooltip placement="topLeft" title={text}>
                  <a href={url}>{url}</a>
                </Tooltip>
              );
            },
          },
          {
            title: t('hiddenPosts.action'),
            key: 'actions',
            render: (text, record) => (
              <Button
                onClick={() => dispatch(unhidePost({ postId: record._id }))}
              >
                {t('hiddenPosts.makeVisible')}
              </Button>
            ),
          },
        ]}
        dataSource={hiddenPosts}
      />
    </div>
  );
};

export default compose(withRedux, withUser, memo)(HiddenPosts);
