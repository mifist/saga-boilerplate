/**
 *
 * CommunityFeeds
 *
 */
import React, { memo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import { convert } from 'html-to-text';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Col, Row, Skeleton, Form, Select, BackTop } from 'antd';

// components
import NewsFeedPost from 'legacy/components/NewsFeedPost';
import EmptyFeed from 'legacy/components/EmptyFeed';
import CreatePublicationv2 from 'legacy/components/CreatePublicationv2';
import { ReportPopup } from 'legacy/components/ReportPopup';

// context
import { withUser } from 'appContext/User.context';

function toArray(obj_obj) {
  return Object.keys(obj_obj).map(i => obj_obj[i]);
}

function CommunityFeeds({
  type,
  feeds,
  tags,
  currentTag,
  media,
  page,
  loading,
  noMore,
  // actions
  changeFilter,
  onLoad,
  onPost,
  onUploadMedia,
  // default props
  className,
  reportPopup,
  setReportPopup,
  reportLoading,
  reportPost,
  user,
  ...rest
}) {
  const childClassNames = classNames('community-feeds-wrapper', className);

  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const scrollParentRef = useRef(null);
  const { id: initialId } = useParams();

  const filteredData = feeds && toArray(feeds);

  const initFilter = {
    sort: 'newest',
    tags: [],
  };

  const [filter, setFilter] = useState(initFilter);
  const [showDuration, setShowDuration] = useState(false);

  const [filterForm] = Form.useForm();

  // Check if we reset values on loading
  useEffect(() => {
    if (type) {
      setFilter(initFilter);
      setShowDuration(false);
      filterForm.resetFields();
    }
  }, [type]);

  // check do we have tag value from side widget
  useEffect(() => {
    if (currentTag) {
      const newFilter = { ...filter, tags: [currentTag] };
      reloadFeeds(newFilter);
    }
  }, [currentTag]);

  // Load Feeds by InfiniteScroll per page
  const onLoadCallback = () => {
    if (initialId) {
      if (type !== 'case') {
        onLoad(initialId, page + 1, filter);
      } else {
        onLoad(initialId, page + 1, filter, 'case');
      }
    } else {
      console.error(
        'Error: undefined "initialId" prop inside onLoadCallback func, in the <CommunityFeeds />',
      );
    }
  };

  const reloadFeeds = filterBy => {
    if (filterBy.hasOwnProperty('tags') && filterBy?.tags == 0) {
      delete filterBy.tags;
    }
    setFilter(filterBy);
    filterForm.setFieldsValue(filterBy);

    if (initialId) {
      if (type !== 'case') {
        onLoad(initialId, 1, filterBy);
      } else {
        onLoad(initialId, 1, filterBy, 'case');
      }
    } else {
      console.error(
        'Error: undefined "initialId" prop inside onLoadCallback func, in the <CommunityFeeds />',
      );
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    let newFilter = filter;
    if (changedValues.hasOwnProperty('tags')) {
      // TODO: commented by Vugar Ahmadov. needs to test again.
      // if (changedValues.tags !== undefined && changedValues.tags.length > 0) {
      newFilter.tags = [changedValues.tags];
      // } else {
      // delete newFilter.tags;
      // }
      reloadFeeds(newFilter);
    }

    if (changedValues.hasOwnProperty('sort')) {
      if (changedValues.sort !== undefined) {
        newFilter.sort = changedValues.sort;
        // show additional filter select
        if (changedValues.sort.indexOf('most') >= 0) {
          setShowDuration(true);
          newFilter.duration = 'week';
        } else {
          setShowDuration(false);
        }
      } else {
        delete newFilter.sort;
      }
      reloadFeeds(newFilter);
    }

    if (changedValues.hasOwnProperty('duration')) {
      if (changedValues.duration !== undefined) {
        newFilter.duration = changedValues.duration;
      } else {
        delete newFilter.duration;
      }
      reloadFeeds(newFilter);
    }

    JSON.stringify(newFilter) != JSON.stringify(initFilter) &&
      reloadFeeds(newFilter);
  };

  // Filter Form
  const filterOutput = () => {
    return (
      <Form
        form={filterForm}
        name="validate_other"
        onValuesChange={onValuesChange}
        initialValues={initFilter}
      >
        <Form.Item name="tags" label={null} className="category-select">
          <Select
            placeholder={t(`communities.${isMobile ? 'tags' : 'allTags'}`)}
            optionFilterProp="children"
            getPopupContainer={trigger => trigger.parentElement}
          >
            {tags && (
              <>
                <Select.Option value={null}>
                  {t('communities.allTags')}
                </Select.Option>
                {tags.map(item => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                ))}
              </>
            )}
          </Select>
        </Form.Item>
        <Form.Item name="sort" label={null} className="sortBy">
          <Select
            optionFilterProp="children"
            placeholder={t('common.sortBy')}
            getPopupContainer={trigger => trigger.parentElement}
          >
            <Select.Option value="newest">
              {t('common.mostRecenet')}
            </Select.Option>
            <Select.Option value="most_liked">
              {t('common.mostLiked')}
            </Select.Option>
            <Select.Option value="most_commented">
              {t('common.mostCommented')}
            </Select.Option>
          </Select>
        </Form.Item>
        {showDuration && (
          <Form.Item name="duration" label={null} className="durationBy">
            <Select
              optionFilterProp="children"
              placeholder={t('communities.showBy')}
              getPopupContainer={trigger => trigger.parentElement}
            >
              <Select.Option value="week">
                {t('communities.pastWeek')}
              </Select.Option>
              <Select.Option value="month">
                {t('communities.pastMonth')}
              </Select.Option>
              <Select.Option value="year">
                {t('communities.pastYear')}
              </Select.Option>
              <Select.Option value="all">
                {t('communities.allTime')}
              </Select.Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    );
  };

  const handleReportNewsFeedPostSubmit = values => {
    const post = feeds.find(post => post._id === reportPopup._id);

    reportPost({
      postText: post.type
        ? post.type === 'post'
          ? convert(post.content, {
              wordwrap: false,
              preserveNewlines: true,
              selectors: [{ selector: 'a', options: { ignoreHref: true } }],
            }).substring(0, 100)
          : post.title.substring(0, 100)
        : post.name.substring(0, 100),
      userEmail: user?.email,
      userFullName:
        user?.description?.firstname + ' ' + user?.description?.lastname,
      reportType: values.reportType,
      reportContent: values.reportContent,
      date: moment().format('YYYY-MM-DD'),
      userId: user?._id,
      postId: post._id,
      url: `/${post.type === 'post' ? 'case' : post.type}/detail/${post._id}`,
    });
  };

  return (
    feeds && (
      <div className={childClassNames}>
        <Row gutter={!isMobile ? [0, 0] : [0, 0]} className="community-feeds">
          <Col span={24}>
            <div className={`community-feeds--create-${type}`}>
              <CreatePublicationv2
                type={type}
                onSubmit={onPost}
                communityId={initialId}
                tags={tags}
              />
            </div>
          </Col>

          <Col span={24} className={`community-feeds__filter`}>
            {filterOutput()}
          </Col>

          <Col
            span={24}
            id={'infinite-scroll-web'}
            /*   className={`${
              isMobile ? 'infinite-scroll-container' : 'infinite-scroll-web'
            }`} */
            ref={scrollParentRef}
          >
            <InfiniteScroll
              className="InfiniteScroll"
              initialLoad={false}
              pageStart={1}
              loadMore={() => !loading && onLoadCallback()}
              hasMore={!noMore}
              useWindow={false}
              getScrollParent={function() {
                const parentRefContainer = document.querySelector(
                  '.custom-mobile-layout',
                );
                return parentRefContainer;
              }}
              loader={
                <div key={`skeleton-load-${page}`}>
                  <Skeleton.Button active shape="round" />
                  <Skeleton.Button active shape="round" />
                  <Skeleton.Button active shape="circle" />
                  <Skeleton active />
                  <Skeleton.Input style={{ width: 200 }} active />
                </div>
              }
            >
              {filteredData &&
                filteredData.map(post => (
                  <NewsFeedPost
                    {...{
                      ...post,
                      likes: post.likes || [], // Default data for populate events
                      comments: post.comments || [],
                      author: post.author || [],
                    }}
                    key={`${post._id}-community-NewsFeedPost-${type}`}
                    typeLike={'community'}
                  />
                ))}
              <BackTop />
            </InfiniteScroll>
            <ReportPopup
              visible={reportPopup.opened}
              onClose={() => setReportPopup({ opened: false, _id: null })}
              onSubmit={handleReportNewsFeedPostSubmit}
              loading={reportLoading}
            />
            {noMore && <EmptyFeed />}
          </Col>
        </Row>
      </div>
    )
  );
}

CommunityFeeds.defaultProps = {
  type: 'post',
};
CommunityFeeds.propTypes = {
  type: PropTypes.oneOf(['post', 'case', 'article', 'podcast', 'event']),
  feeds: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.object.isRequired,
  ]),
  media: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.object.isRequired,
  ]),
  tags: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.object.isRequired,
  ]),
  onLoad: PropTypes.func,
  onPost: PropTypes.func,
  onUploadMedia: PropTypes.func,
  reportPopup: PropTypes.object,
};

export default compose(
  memo,
  withUser,
)(CommunityFeeds);
