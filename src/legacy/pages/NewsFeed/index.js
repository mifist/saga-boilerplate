/**
 *
 * NewsFeed
 *
 */

import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

import { convert } from 'html-to-text';

import './style.scss';

import moment from 'moment';

import InfiniteScroll from 'react-infinite-scroller';
import {
  selectNewsFeedImages,
  selectNewsFeedPosts,
  selectNewsFeedPostsLoading,
  selectNoMore,
  selectNewsFeedPage,
  selectLoadingNewPost,
  makeSelectDeletedPosts,
  makeSelectReportPopup,
  makeSelectReportLoading,
} from './selectors';
import {
  flush,
  loadPosts,
  postPublication,
  uploadImages,
  setDeletedPostAction,
  setReportPopup as setReportPopupAction,
  reportPost as reportPostAction,
} from './actions';

import { Helmet } from 'react-helmet';
import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Col, Row, Skeleton } from 'antd';

// components
import NewsFeedPost from 'components/NewsFeedPost';
import ProfileSuggestions from 'containers/ProfileSuggestions';
import UserWalkthrough from 'components/UserWalkthrough';
import EmptyFeed from 'components/EmptyFeed';
import { ReportPopup } from 'components/ReportPopup';
import CreatePublicationv2 from 'components/CreatePublicationv2';

import { useHistory, useLocation } from 'react-router-dom';

// contexts
import { withUser } from 'engine/Contexts/User.context';
import QrcodePopup from 'legacy/components/QrcodePopup';

export function NewsFeedPage({
  loadPostsAction,
  posts,
  noMore,
  loadingPosts,
  uploadImagesAction,
  imagesUploaded,
  postPublicationAction,
  flushAction,
  page,
  loadingNewPost,
  addDeletedPost,
  deletedPosts,
  position,
  user,
  reportPost,
  reportPopup,
  loading,
  setReportPopup,
}) {
  useInjectReducer({ key: 'newsFeedList', reducer });
  useInjectSaga({ key: 'newsFeedList', saga });

  const { i18n } = useTranslation();

  const history = useHistory();

  const { isMobile } = useDeviceDetect();

  const scrollParentRef = useRef(null);
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const handleLoadMore = () => {
    loadPostsAction(page + 1);
  };

  useEffect(() => {
    if (
      history?.location?.state?.from == 'case_detail' &&
      history?.location?.state?.deletedId &&
      posts?.length > 0
    ) {
      const deletedPostsIDs = [
        ...deletedPosts,
        history?.location?.state?.deletedId,
      ];
      addDeletedPost(deletedPostsIDs);
      const infiniteScroll = Array.from(
        document.getElementsByClassName(`InfiniteScroll`),
      );
      const nodeList = Array.from(infiniteScroll[0].childNodes);
      // hide deleted item
      for (let key in nodeList) {
        const elem = nodeList[key];
        deletedPostsIDs?.map(postId => {
          const elemClass = `${postId}-main-feeds`;
          if (elem.classList.contains(elemClass)) {
            elem.classList.add('hide');
          }
        });
      }
    }
  }, [history?.location?.state?.from]);

  useEffect(() => {
    if (page === 1) {
      loadPostsAction(page);
    }

    const elementScroll = document.querySelector('#infinite-scroll-web');
    if (elementScroll) {
      elementScroll.addEventListener('scroll', function(e) {
        window.requestAnimationFrame(() =>
          localStorage.setItem('newsfeedScroll', elementScroll.scrollTop),
        );
      });

      elementScroll.addEventListener('scroll', function(e) {
        window.onunload = () => localStorage.setItem('newsfeedScroll', 0);
      });
    }

    if (localStorage.getItem('newsfeedScroll')) {
      document.querySelector('#infinite-scroll-web').scrollTop = Number(
        localStorage.getItem('newsfeedScroll'),
      );
    }

    return () => {
      if (history?.location?.state?.from !== 'newsfeed_post') {
        localStorage.setItem('newsfeedScroll', 0);
        flushAction();
        // setDeletedPost([]);
      }
    };
  }, []);

  const renderInfiniteList = useMemo(() => {
    return posts?.map((post, index) => (
      <NewsFeedPost
        {...{
          ...post,
          likes: post.likes || [], // Default data for populate events
          comments: post.comments || [],
          author: post.author || [],
        }}
        id={`${post?._id}-main-feeds`}
        className={`${post?._id}-main-feeds`}
        key={`${index}_${post?._id}_${post.type}-main-feeds`}
        lang={i18n.language}
      />
    ));
  }, [posts, deletedPosts, page, i18n.language]);

  const handleReportNewsFeedPostSubmit = values => {
    const post = posts.find(post => post._id === reportPopup._id);

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
    <div className={`MainNewsFeed`}>
      <Helmet>
        <title>Newsfeed</title>
        <meta name="description" content="Description of News Feed" />
      </Helmet>
      <UserWalkthrough />
      {user?._id && (
        <QrcodePopup newsfeed={true} qrcode={searchParams.get('qrcode')} />
      )}
      <Row gutter={!isMobile ? [30, 30] : [0, 26]}>
        <Col
          id={'infinite-scroll-web'}
          className={`${
            isMobile ? 'infinite-scroll-container' : 'infinite-scroll-web'
          }`}
          xs={24}
          lg={16}
          xl={16}
          ref={scrollParentRef}
        >
          <CreatePublicationv2 type="post" onSubmit={postPublicationAction} />
          <InfiniteScroll
            className="InfiniteScroll"
            initialLoad={false}
            pageStart={1}
            loadMore={() => handleLoadMore()}
            hasMore={!noMore}
            useWindow={false}
            getScrollParent={() => scrollParentRef.current}
            /*  getScrollParent={function() {
              const parentRefContainer = document.querySelector(
                '.custom-mobile-layout',
              );
              return parentRefContainer;
            }} */

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
            {renderInfiniteList}
          </InfiniteScroll>
          <ReportPopup
            visible={reportPopup.opened}
            onClose={() => setReportPopup({ opened: false, _id: null })}
            onSubmit={handleReportNewsFeedPostSubmit}
            loading={loading}
          />
          {noMore && <EmptyFeed />}
        </Col>
        {!isMobile && (
          <Col
            xs={24}
            lg={8}
            xl={8}
            style={{
              backgroundColor: 'transparent',
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <div style={{ position: 'sticky', top: 100 }}>
              <ProfileSuggestions key={'external-sugess'} type={'external'} />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

NewsFeedPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushAction: PropTypes.func.isRequired,
  loadPostsAction: PropTypes.func,
  posts: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  posts: selectNewsFeedPosts(),
  page: selectNewsFeedPage(),
  loadingPosts: selectNewsFeedPostsLoading(),
  imagesUploaded: selectNewsFeedImages(),
  noMore: selectNoMore(),
  loadingNewPost: selectLoadingNewPost(),
  deletedPosts: makeSelectDeletedPosts(),
  reportPopup: makeSelectReportPopup(),
  loading: makeSelectReportLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadPostsAction: page => dispatch(loadPosts(page)),
    flushAction: () => dispatch(flush()),
    uploadImagesAction: images => dispatch(uploadImages(images)),
    addDeletedPost: arrIds => dispatch(setDeletedPostAction(arrIds)),
    postPublicationAction: publication =>
      dispatch(postPublication(publication)),
    setReportPopup: data => dispatch(setReportPopupAction(data)),
    reportPost: data => dispatch(reportPostAction(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withUser,
)(NewsFeedPage);
