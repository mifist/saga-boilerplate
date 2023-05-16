import React, { memo, useEffect, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import camelCase from 'lodash/camelCase';
import classNames from 'classnames';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import {
  updatePodcast,
  flushState,
  loadPodcast,
  onDelete,
  pinUnpinPost,
  hideUnhidePost,
} from './actions';

// assets
import defaultPodcastImage from 'images/podcast.jpg';

// antd component
import { Col, Empty, Layout, Row, Spin } from 'antd';
// components
import CommentsOverview from 'legacy/containers/CommentsOverview';
import GoBackButton from 'legacy/components/GoBackButton';
import BookmarkAction from 'legacy/components/BookmarkAction';
import ShareAction from 'legacy/components/ShareAction';
import MediaPlayer from 'legacy/components/MediaPlayer';
import CreatePublicationv2 from 'legacy/components/CreatePublicationv2';
import SidebarPodcastInfo from 'legacy/components/Sidebar/SidebarPodcastInfo';

// contexts
import { withUser } from 'appContext/User.context';
// utils
import useDeviceDetect from 'appHooks/useDeviceDetect';

export function PodcastDetail({
  // props
  user,
  history,
  // default props
  className,
  // core
  state,
  dispatch,
}) {
  const {
    podcast: { data: podcast },
    loading,
    error,
    deleteSuccessful,
  } = state.PodcastDetail;

  const { t, i18n } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const { id: initialId } = useParams();

  useEffect(() => {
    if (initialId) {
      dispatch(loadPodcast(initialId));
    }

    return () => {
      // Clearing the state after unmounting a component
      dispatch(flushState());
    };
  }, [initialId]);

  // Redirect on successful post deletion
  useEffect(() => {
    if (deleteSuccessful) {
      dispatch(flushState());
      history.goBack();
    }
  }, [deleteSuccessful]);

  // render function
  return (
    <div className="main-full-content">
      <Row gutter={[0, 30]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {podcast && !loading && (
          <Layout
            className={classNames(
              'main-single-layout with-sidebar',
              i18n.language === 'ar' && 'main-single-layout--rtl',
            )}
          >
            <Layout.Content className="main-single-content podcasts">
              <Row className="main-single-content__header podcasts white">
                <span
                  className="podcasts-bg"
                  style={{
                    backgroundImage: `url(${
                      podcast?.pictures.length === 0
                        ? defaultPodcastImage
                        : podcast.pictures
                    })`,
                  }}
                />
                <div className="main-single-content__header--top">
                  <GoBackButton
                    goTo="/podcast"
                    label={!isMobile && t('podcasts.backToPodcasts')}
                  />
                  {podcast.author.some((e) => e._id === user._id) && (
                    <CreatePublicationv2
                      type="podcast"
                      initialData={podcast}
                      onSubmit={(data) =>
                        dispatch(updatePodcast(data, 'update'))
                      }
                    />
                  )}
                </div>

                <Col xs={24} className="podcast-header">
                  {podcast?.pictures.length === 0 ? (
                    <img width={141} height={141} src={defaultPodcastImage} />
                  ) : (
                    <img width={141} src={podcast.pictures} />
                  )}
                  {podcast.title && (
                    <h1 className="article-title">{podcast.title}</h1>
                  )}
                  {podcast?.audio && (
                    <MediaPlayer type="big" url={podcast.audio} />
                  )}
                </Col>
              </Row>
              <Row className="main-single-content__main podcasts">
                <Col xs={24}>
                  <article className="main-single-content__article">
                    <div className="article-detail">
                      <Row>
                        <Col span={24} style={{ marginBottom: 20 }}>
                          <div className="detail-row description">
                            <h3 className="description-title">
                              {t('common.summary')}
                            </h3>
                            {podcast.content && (
                              <div
                                className="article-content-html"
                                dangerouslySetInnerHTML={{
                                  __html: podcast.content,
                                }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col span={12}>
                          {podcast?.anatomy && (
                            <div className="detail-item category">
                              <span className="detail-item__label">
                                {t('common.anatomy')}
                              </span>
                              <span className="detail-item__content">
                                {podcast.anatomy.map((item) => (
                                  <span
                                    key={item}
                                    className="item"
                                    style={{ marginRight: 5 }}
                                  >
                                    {t(`common.anatomies-${camelCase(item)}`)}
                                  </span>
                                ))}
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col span={12}>
                          {podcast?.speciality &&
                            podcast.speciality.length > 0 && (
                              <div className="detail-item speciality">
                                <span className="detail-item__label">
                                  {t('common.domain')}
                                </span>
                                <span className="detail-item__content">
                                  {podcast.speciality.map((item) => (
                                    <span
                                      key={item}
                                      className="item"
                                      style={{ marginRight: 5 }}
                                    >
                                      {t(
                                        `common.specialities-${camelCase(
                                          item,
                                        )}`,
                                      )}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            )}
                        </Col>
                      </Row>
                      <br />
                      <br />
                      <div className="detail-row narrow">
                        <div className="detail-item ">
                          <BookmarkAction type="button" _id={podcast._id} />
                        </div>
                        <div className="detail-item ">
                          <ShareAction type="list" title={podcast.title} />
                        </div>
                      </div>
                    </div>
                    <section className="article-main">
                      <h3
                        className="section-title"
                        style={{ marginBottom: '24px' }}
                      >
                        {t('common.speakers')}
                      </h3>
                      {podcast.persons && (
                        <div className="description-content">
                          <p>{podcast.persons}</p>
                        </div>
                      )}
                    </section>
                  </article>
                </Col>
              </Row>
              {podcast && (
                <div id="comments">
                  <CommentsOverview
                    onDelete={() => dispatch(onDelete(podcast._id))}
                    onPinUnpinPost={() =>
                      dispatch(
                        onPinUnpinPost({
                          postId: podcast._id,
                          pinned: podcast.pinned ? false : true,
                        }),
                      )
                    }
                    onHideUnhidePost={() =>
                      dispatch(
                        onHideUnhidePost({
                          postId: podcast._id,
                          hidden: podcast.hidden ? false : true,
                        }),
                      )
                    }
                    commentType="podcast"
                    itemData={podcast}
                    changeItem={(data) =>
                      dispatch(
                        updatePodcast(
                          {
                            _id: data._id,
                            likes: data.likes.map((like) => ({
                              _id: like._id,
                            })),
                          },
                          'like',
                        ),
                      )
                    }
                    className="podcasts"
                  />
                </div>
              )}
            </Layout.Content>
            {!isMobile && (
              <Layout.Sider
                width={324}
                style={{ backgroundColor: 'transparent' }}
              >
                <SidebarPodcastInfo podcast={podcast} />
              </Layout.Sider>
            )}
          </Layout>
        )}
        {!podcast && !loading && <Empty description={t('common.noData')} />}
      </Row>
    </div>
  );
}

export default compose(withRedux, withUser, memo)(PodcastDetail);
