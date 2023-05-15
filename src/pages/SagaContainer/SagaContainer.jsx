/**
 * SagaContainer
 */
import React, { memo } from 'react';
import { useParams  } from 'react-router-dom';
import { compose } from '@reduxjs/toolkit';

// HOC
import withRedux from 'HOC/withRedux';

// actions
import { flushState, onLoadList } from './actions';

// antd component
import { Skeleton, List, Avatar, Button } from 'antd';

function SagaContainer({
  // core
  state,
  dispatch
}) {
  const { list, loading } = state.SagaContainer;

  const { eventID } = useParams();


  const count = 5;

  const onLoadMore = () => {
    dispatch(onLoadList(count));
  };

  const loadMore = !loading ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={onLoadMore}>loading more</Button>
    </div>
  ) : null;

  return (
    <>
      <h2>SagaContainer</h2>
      
      <h2>Event ID: {eventID}</h2>

      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name?.last}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
}

export default compose(memo, withRedux)(SagaContainer);
