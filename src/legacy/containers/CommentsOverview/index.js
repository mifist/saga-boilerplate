import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link, useParams, withRouter, useLocation } from 'react-router-dom';
import moment from 'moment';
import { convert } from 'html-to-text';
import { useTranslation } from 'react-i18next';

import { Col, Dropdown, Empty, Menu, Popconfirm, Row, Tabs } from 'antd';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import {
  flushState,
  loadComments,
  setReportPopupOpened as setReportPopupOpenedAction,
  reportPost as reportPostAction,
  setModifyPostTypePopupOpened as setModifyPostTypePopupOpenedAction,
  modifyPostType as modifyPostTypeAction,
  updateCommentList as updateCommentListAction,
} from './actions';

import {
  makeSelectComments,
  makeSelectCommentsOverview,
  makeSelectError,
  makeSelectLoading,
  makeSelectReportPopupOpened,
  makeSelectModifyPostTypePopupOpened,
} from './selectors';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component

// icons
import CustomIcons from 'legacy/legacy/components/CustomIcons';

// components
import CommentItem from 'legacy/components/Comments/CommentItem';
import BookmarkAction from 'legacy/components/BookmarkAction';
import ShareAction from 'legacy/components/ShareAction';
import ModalWithLikes from 'legacy/components/ModalWithLikes';
import { ReportPopup } from 'legacy/components/ReportPopup';
import { ModifyPostTypePopup } from 'legacy/components/ModifyPostTypePopup';
import CommentFormNew from 'legacy/components/Comments/CommentFormNew';

// global user
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

import { getCommentsCount } from 'utils/generalHelper';

function CommentsOverview({
  commentType,
  comments,
  loading,
  loadComments,
  // footer
  itemData,
  changeItem,
  className,
  user,
  onDelete,
  onPinUnpinPost,
  onHideUnhidePost,
  flushState,
  setAuthPopup,
  reportPopupOpened,
  setReportPopupOpened,
  reportPost,
  modifyPostTypePopupOpened,
  setModifyPostTypePopupOpened,
  modifyPostType,
  updateCommentList,
}) {
  useInjectReducer({ key: 'commentsOverview', reducer });
  useInjectSaga({ key: 'commentsOverview', saga });

  const isActiveLike = itemData.likes.some(like => like?._id === user._id);
  const { t, i18n } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const { id: initialId } = useParams();
  const childClassNames = classNames('details-bottom-section', className);

  const [commentTabNumber, setCommentTabNumber] = useState('1');
  const [showMainComment, setShowMainComment] = useState(false);

  const [bookmark, setBookmark] = useState(false);

  const commentsSection = useRef(null);

  const { pathname, hash } = useLocation();

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [pathname, hash, loading]);

  useEffect(() => {
    if (initialId) {
      loadComments(initialId, commentType);
    }
  }, [initialId]);

  useEffect(() => {
    return () => {
      flushState();
    };
  }, []);

  const scrollDownComments = () => commentsSection.current.scrollIntoView();

  const otherAction = (
    <Menu style={{ width: '160px' }}>
      {(itemData?.community?.admins?.includes(user._id) ||
        itemData?.community?.moderators?.includes(user._id) ||
        itemData.author.some(i => i._id === user._id)) && (
        <>
          <Menu.Item key="delete">
            <Popconfirm
              title={t('common.areYouSure')}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              onConfirm={onDelete}
            >
              <a href="#">{t('common.delete')}</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      {user.role === 'admin' && !itemData?.community && itemData.type && (
        <>
          <Menu.Item key="pin" onClick={onPinUnpinPost}>
            {t(`common.${itemData.pinned ? 'unpin' : 'pin'}`)}
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      {user.role === 'admin' && itemData.type && (
        <>
          <Menu.Item key="hide" onClick={onHideUnhidePost}>
            {t(`common.${itemData.hidden ? 'makePostVisible' : 'hidePost'}`)}
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      {user.role === 'admin' &&
        (itemData.type === 'post' || itemData.type === 'case') && (
          <>
            <Menu.Item
              key="modifyType"
              onClick={() => setModifyPostTypePopupOpened(true)}
            >
              {t('common.modifyType')}
            </Menu.Item>
            <Menu.Divider />
          </>
        )}
      <Menu.Item key="report" onClick={() => setReportPopupOpened(true)}>
        {t('common.report')}
      </Menu.Item>
    </Menu>
  );

  const onPressLike = () => {
    if (user?._id) {
      if (isActiveLike) {
        changeItem(
          {
            ...itemData,
            likes: itemData.likes.filter(i => i?._id !== user._id),
          },
          'like',
        );
      } else {
        changeItem({ ...itemData, likes: [...itemData.likes, user] }, 'like');
      }
    } else {
      setAuthPopup({ open: true });
    }
  };

  const handleReportPostSubmit = values => {
    reportPost({
      postText: itemData.type
        ? itemData.type === 'post'
          ? convert(itemData.content, {
              wordwrap: false,
              preserveNewlines: true,
              selectors: [{ selector: 'a', options: { ignoreHref: true } }],
            }).substring(0, 100)
          : itemData.title.substring(0, 100)
        : itemData.name.substring(0, 100),
      userEmail: user?.email,
      userFullName:
        user?.description?.firstname + ' ' + user?.description?.lastname,
      reportType: values.reportType,
      reportContent: values.reportContent,
      date: moment().format('YYYY-MM-DD'),
      userId: user?._id,
      postId: itemData._id,
      url: location.pathname,
    });
  };

  const handleModifyPostTypeSubmit = values => {
    modifyPostType({
      _id: itemData._id,
      type: values.postType,
      title: values.caseTitle || null,
    });
  };

  // render function
  return (
    <div className={childClassNames}>
      <footer
        className={classNames(
          'article-footer',
          i18n.language === 'ar' && 'article-footer--rtl',
        )}
      >
        <div className="article-footer__actions">
          {commentType !== 'event' && (
            <>
              <span
                className={classNames(
                  'comment-likes',
                  isActiveLike && 'active',
                )}
                onClick={onPressLike}
              >
                <CustomIcons type={isActiveLike ? 'downvote' : 'upvote'} />
              </span>
              <span
                className={classNames(
                  'article-likes--number',
                  isActiveLike && 'active',
                )}
              >
                <ModalWithLikes
                  dataSourse={itemData}
                  community={itemData?.community}
                  userLikes={itemData.likes.length}
                  className="overview_comments-form-likes"
                />
              </span>
            </>
          )}

          <span className="article-comments" onClick={scrollDownComments}>
            <Link to="#comments">
              <CustomIcons type="comments" />
              <span className="article-comments--number">
                {getCommentsCount(comments)}
                <span className="text">{t('common.comments')}</span>
              </span>
            </Link>
          </span>
          <span className="article-other">
            {user?.role !== 'industry' && (
              <BookmarkAction
                type="icon"
                key={`eventdetail-icon-${initialId}`}
                typeBookMark={commentType}
                _id={initialId}
                className={'icon_overview_comments'}
                bookmark={bookmark}
                action={setBookmark}
              />
            )}
            <ShareAction
              type="dropdown"
              title={
                itemData.title === undefined ? itemData.name : itemData?.title
              }
              content={itemData.content}
            />
            {user?._id && (
              <>
                <Dropdown
                  overlay={otherAction}
                  trigger={['click']}
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  <a
                    className="ant-dropdown-link"
                    onClick={e => e.preventDefault()}
                  >
                    <CustomIcons type="dots-vertical" />
                  </a>
                </Dropdown>
                <ReportPopup
                  visible={reportPopupOpened}
                  onClose={() => setReportPopupOpened(false)}
                  onSubmit={handleReportPostSubmit}
                  loading={loading}
                />
                <ModifyPostTypePopup
                  visible={modifyPostTypePopupOpened}
                  onClose={() => setModifyPostTypePopupOpened(false)}
                  onSubmit={handleModifyPostTypeSubmit}
                  loading={loading}
                />
              </>
            )}
          </span>
        </div>
      </footer>
      <Row
        id="comments-tabs"
        className="main-single-content__comments"
        ref={commentsSection}
      >
        <Col xs={24}>
          <CommentFormNew
            nodeType="parent"
            postType={commentType}
            actionType="post"
            postData={itemData}
            onSubmitResponse={data => updateCommentList('add', data)}
            showForm={showMainComment}
            setShowForm={setShowMainComment}
          />
        </Col>
        <Col xs={24} style={{ marginBottom: '450px' }}>
          {comments && (
            <Tabs
              className="comments-tabs"
              defaultActiveKey="1"
              activeKey={commentTabNumber}
              onChange={activeKey => setCommentTabNumber(activeKey)}
            >
              <Tabs.TabPane
                tab={t(
                  `common.${isMobile ? 'allCommentsShort' : 'allComments'}`,
                  { count: getCommentsCount(comments) },
                )}
                key="1"
              >
                <div className="comments-list-section">
                  {comments.map(comment => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      commentType={commentType}
                      postData={itemData}
                      nodeType="parent"
                      updateCommentList={updateCommentList}
                    >
                      {comment.answers?.length > 0 &&
                        comment.answers.map(answer => (
                          <CommentItem
                            key={answer?._id}
                            comment={answer}
                            commentType={commentType}
                            postData={itemData}
                            nodeType="child"
                            updateCommentList={updateCommentList}
                            parent={comment}
                          />
                        ))}
                    </CommentItem>
                  ))}
                </div>
              </Tabs.TabPane>
            </Tabs>
          )}
          {(!comments || comments.length === 0) && (
            <Empty description={t('common.noComments')} />
          )}
        </Col>
      </Row>
    </div>
  );
}

CommentsOverview.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
  commentType: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  comments: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  loading: PropTypes.bool,
  loadComments: PropTypes.func,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
  ]),
  // footer
  changeItem: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  state: makeSelectCommentsOverview(),
  comments: makeSelectComments(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  reportPopupOpened: makeSelectReportPopupOpened(),
  modifyPostTypePopupOpened: makeSelectModifyPostTypePopupOpened(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushState()),
    loadComments: (id, commentType) => dispatch(loadComments(id, commentType)),
    setReportPopupOpened: opened =>
      dispatch(setReportPopupOpenedAction(opened)),
    reportPost: data => dispatch(reportPostAction(data)),
    setModifyPostTypePopupOpened: opened =>
      dispatch(setModifyPostTypePopupOpenedAction(opened)),
    modifyPostType: data => dispatch(modifyPostTypeAction(data)),
    updateCommentList: (actionType, data) =>
      dispatch(updateCommentListAction(actionType, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withUser,
  withAuthPopup,
)(CommentsOverview);
