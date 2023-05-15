import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useParams, withRouter } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

import './style.scss';

import {
  updateArticle as updateArticleAction,
  flushState as flushStateAction,
  loadArticle as loadArticleAction,
  onDelete as onDeleteAction,
  pinUnpinPost as pinUnpinPostAction,
  hideUnhidePost as hideUnhidePostAction,
} from './actions';

import {
  makeSelectArticle,
  makeSelectError,
  makeSelectLoading,
  selectDeleteSuccessful,
} from './selectors';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Button, Col, Empty, Layout, Row, Spin } from 'antd';

// components
import CommentsOverview from 'legacy/containers/CommentsOverview';
import GoBackButton from 'components/GoBackButton';
import BookmarkAction from 'components/BookmarkAction';
import ShareAction from 'components/ShareAction';
import SidebarAuthorsList from 'components/Sidebar/SidebarAuthorsList';
import CreatePublicationv2 from 'components/CreatePublicationv2';

// contexts
import { withUser } from 'engine/context/User.context';

export function ArticleDetail({
  article,
  loadArticle,
  updateArticle,
  loading,
  onDelete,
  onPinUnpinPost,
  onHideUnhidePost,
  user,
  deleteSuccessful,
  error,
  history,
  flushState,
}) {
  useInjectReducer({ key: 'articleDetail', reducer });
  useInjectSaga({ key: 'articleDetail', saga });

  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const { id: initialId } = useParams();

  useEffect(() => {
    if (initialId) {
      loadArticle(initialId);
    }

    return () => {
      flushState();
    };
  }, [initialId]);

  // Redirect on successful post deletion
  useEffect(() => {
    if (deleteSuccessful) {
      flushState();
      history.goBack();
    }
  }, [deleteSuccessful]);

  // render function
  return (
    <div className="main-full-content">
      <Row gutter={[0, 30]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {article && !loading && (
          <Layout className="main-single-layout with-sidebar">
            <Layout.Content className="main-single-content articles">
              <div className="main-single-content__header articles-header articles-header-detail white">
                <GoBackButton
                  goTo="/article"
                  label={!isMobile && t('articles.backToArticles')}
                />
                {article.author.some(e => e._id === user._id) && (
                  <CreatePublicationv2
                    type="article"
                    initialData={article}
                    onSubmit={data => updateArticle(data, 'update')}
                  />
                )}
              </div>
              <Row className="main-single-content__header articles-title white">
                <Col xs={24}>
                  <h2>{t('common.articles')}</h2>
                  <h3 className="sub-title">
                    {t('articles.scientificResources')}{' '}
                    <span>{t('articles.onBeeMed')}</span>
                  </h3>
                </Col>
              </Row>
              <Row className="main-single-content__main articles">
                <Col xs={24}>
                  <article className="main-single-content__article">
                    <header className="article-header">
                      {article.title && (
                        <h1 className="article-title">{article.title}</h1>
                      )}
                    </header>
                    <div className="article-detail">
                      <div className="detail-row">
                        {article?.reference && (
                          <div className="detail-item reference">
                            <span className="detail-item__label">
                              {t('articles.reference')}
                            </span>
                            <span className="detail-item__content">
                              <span className="item">
                                {t(
                                  `common.references-${camelCase(
                                    article.reference,
                                  )}`,
                                )}
                              </span>
                            </span>
                          </div>
                        )}
                        {article?.anatomy && (
                          <div className="detail-item category">
                            <span className="detail-item__label">
                              {t('articles.category')}
                            </span>
                            <span className="detail-item__content">
                              {article.anatomy.map(anatomy => (
                                <span
                                  key={anatomy}
                                  className="item"
                                  style={{ marginRight: 5 }}
                                >
                                  {t(`common.anatomies-${camelCase(anatomy)}`)}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                        {article?.speciality && article.speciality.length > 0 && (
                          <div className="detail-item speciality">
                            <span className="detail-item__label">
                              {t('common.domains')}
                            </span>
                            <span className="detail-item__content">
                              {article.speciality.map(speciality => (
                                <span
                                  key={speciality}
                                  className="item"
                                  style={{ marginRight: 5 }}
                                >
                                  {t(
                                    `common.specialities-${camelCase(
                                      speciality,
                                    )}`,
                                  )}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="detail-item publication-date">
                        <span className="detail-item__label">
                          {t('articles.publicationDate')}
                        </span>
                        <span className="detail-item__content">
                          {article.speciality.map(item => (
                            <span
                              key={item}
                              className="item"
                              style={{ marginRight: 5 }}
                            >
                              {moment(article.date_creation).format(
                                'MMM. YYYY',
                              )}
                            </span>
                          ))}
                        </span>
                      </div>
                      {!isMobile && (
                        <div className="detail-row narrow">
                          <div className="detail-item ">
                            <BookmarkAction type="button" _id={article._id} />
                          </div>
                          <div className="detail-item ">
                            <ShareAction type="list" title={article.title} />
                          </div>
                        </div>
                      )}
                    </div>
                    <section className="article-main">
                      <h3 className="section-title">{t('common.summary')}</h3>
                      {article.content && (
                        <div
                          className="article-content-html"
                          dangerouslySetInnerHTML={{
                            __html: article.content,
                          }}
                        />
                      )}
                      <br />
                      {article.hasOwnProperty('digest') && (
                        <Button
                          target={'_blank'}
                          type="default"
                          className="bm-btn-default"
                          href={article.digest}
                        >
                          {t('articles.articleDigest')}
                        </Button>
                      )}
                      <br />
                      {article.hasOwnProperty('fullArticle') && (
                        <Button
                          target={'_blank'}
                          type="default"
                          className="bm-btn-default"
                          href={article.fullArticle}
                        >
                          {t('articles.fullArticle')}
                        </Button>
                      )}
                    </section>
                  </article>
                </Col>
              </Row>

              {article && (
                <div id="comments">
                  <CommentsOverview
                    onDelete={() => onDelete(article._id)}
                    onPinUnpinPost={() =>
                      onPinUnpinPost({
                        postId: article._id,
                        pinned: article.pinned ? false : true,
                      })
                    }
                    onHideUnhidePost={() =>
                      onHideUnhidePost({
                        postId: article._id,
                        hidden: article.hidden ? false : true,
                      })
                    }
                    commentType="article"
                    itemData={article}
                    changeItem={data =>
                      updateArticle(
                        {
                          _id: data._id,
                          likes: data.likes.map(like => ({ _id: like._id })),
                        },
                        'like',
                      )
                    }
                    className="articles"
                  />
                </div>
              )}
            </Layout.Content>
            {!isMobile && (
              <Layout.Sider
                width={324}
                style={{ backgroundColor: 'transparent' }}
              >
                <SidebarAuthorsList persons={article.persons} />
                {/* TODO: Hide this part vor v1 of app
                <SidebarActualArticles articles={articles} />
                */}
              </Layout.Sider>
            )}
          </Layout>
        )}
        {!article && !loading && <Empty description={t('common.noData')} />}
      </Row>
    </div>
  );
}

ArticleDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  article: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  loadArticle: PropTypes.func,
  updateArticle: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  article: makeSelectArticle(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  deleteSuccessful: selectDeleteSuccessful(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushStateAction()),
    loadArticle: id => dispatch(loadArticleAction(id)),
    updateArticle: (data, actionType) =>
      dispatch(updateArticleAction(data, actionType)),
    onDelete: id => dispatch(onDeleteAction(id)),
    onPinUnpinPost: ({ postId, pinned }) =>
      dispatch(pinUnpinPostAction(postId, pinned)),
    onHideUnhidePost: ({ postId, hidden }) =>
      dispatch(hideUnhidePostAction(postId, hidden)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  withRouter,
  withUser,
)(ArticleDetail);
