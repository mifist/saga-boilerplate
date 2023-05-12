/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet';
// store
import { useInjectSaga, useInjectReducer } from 'store';
import reducer from './reducer';
import saga from './saga';
// actions
import { flushState, onLoadList } from './actions';
//selectors
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectList,
} from './selectors';

// antd component
import { Skeleton, List, Avatar, Button } from 'antd';



function SagaContainer({
  list,
  onLoadList
}) {
  const key = "appSagaContainer";
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const count = 5;
  const [loading, setLoading] = useState(false);
  
  const onLoadMore = () => {
    setLoading(true);
    onLoadList(count);
    setLoading(false);
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
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
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

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  list: makeSelectList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushState()),
    onLoadList: (list) => dispatch(onLoadList(list)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SagaContainer);

