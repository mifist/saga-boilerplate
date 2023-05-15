/**
 *
 * OverViewComments
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './style.scss';

import LikeClicked from 'images/icons/like_clicked.svg';
import Like from 'images/icons/like.svg';

import {
  updateLikes,
  setReportPopup as setReportPopupAction,
} from 'legacy/pages/NewsFeed/actions';
import { updateLikesCase } from 'legacy/pages/CaseOverview/actions';
import {
  updateLikesCommunity,
  setReportPopup as setReportPopupCommunityAction,
} from 'legacy/pages/CommunityDetail/actions';

import { Col, Row, Space, Dropdown, Menu } from 'antd';

import CustomIcons from 'legacy/components/CustomIcons';

import BookmarkAction from 'legacy/components/BookmarkAction';
import LinkWrapper from 'legacy/components/LinkWrapper';
import ShareAction from 'legacy/components/ShareAction';
import ModalWithLikes from 'legacy/components/ModalWithLikes';

// global user
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

function OverViewComments({
  post,
  updateLikes,
  communityName,
  user,
  updateLikesCase,
  updateLikesCommunity,
  typeLike,
  layout,
  from,
  setAuthPopup,
  setReportPopup,
  setReportPopupCommunity,
}) {
  const { t, i18n } = useTranslation();
  const { _id, type, likes, comments } = post;

  const active = likes.some((e) => e?._id === user._id);

  // Footer
  const shareUrl = (post) => {
    const postType = post?.type;
    switch (postType) {
      case 'post':
        return `/case/detail/${_id}`;
      case 'case':
        return `/case/detail/${_id}`;
      case 'event':
        return `/event/detail/${_id}`;
      case 'article':
        return `/article/detail/${_id}`;
      case 'podcast':
        return `/podcast/detail/${_id}`;
    }
  };

  const onPressLike = (e) => {
    e.preventDefault();

    if (user?._id) {
      if (type === 'event') {
        return false;
      }

      if (active) {
        const withOutId = post.likes.filter((i) => i?._id !== user._id);
        const newPostObj = { ...post, likes: withOutId };

        if (typeLike == 'post') {
          updateLikes(newPostObj);
        } else if (typeLike == 'case') {
          updateLikesCase(newPostObj);
        } else if (typeLike == 'community') {
          updateLikesCommunity(newPostObj);
        }
      } else {
        const updatedPostObj = { ...post, likes: [...post.likes, user] };

        if (typeLike == 'post') {
          updateLikes(updatedPostObj);
        } else if (typeLike == 'case') {
          updateLikesCase(updatedPostObj);
        } else if (typeLike == 'community') {
          updateLikesCommunity(updatedPostObj);
        }
      }
    } else {
      setAuthPopup({ open: true });
    }
  };

  return (
    <div
      className={classNames(
        'overview_comments',
        layout,
        i18n.language === 'ar' && 'overview_comments--rtl',
      )}
    >
      <Row>
        <Col span={layout !== 'single' ? 16 : 24}>
          <Space>
            {type !== 'event' ? (
              <>
                <span className="like-button" onClick={onPressLike}>
                  {active ? (
                    <img
                      src={LikeClicked}
                      className={'icon_likeclicked'}
                      alt={'icon likes action'}
                    />
                  ) : (
                    <img
                      src={Like}
                      className={'icon_like'}
                      alt={'icon likes action'}
                    />
                  )}
                </span>
                <span
                  className={`overViewNumber ${
                    active ? 'overViewNumberActive' : ''
                  }`}
                >
                  <ModalWithLikes
                    dataSourse={post}
                    community={post?.community}
                    communityName={communityName}
                    userLikes={likes.length}
                    className="overview_comments-form-likes"
                  />
                </span>
              </>
            ) : null}
            <LinkWrapper
              className={'custom-feed'}
              type={type}
              _id={_id}
              goBackName="common.backToFeed"
              extraParams={{
                hash: '#comments',
                from,
              }}
            >
              <CustomIcons type="comments" />
              <span className="comments-feed">
                {comments ? comments.length : 0} {t('common.comments')}
              </span>
            </LinkWrapper>
          </Space>
        </Col>
        {layout !== 'single' && (
          <Col span={8} className={'overview_comments_right'}>
            {user.role !== 'industry' && (
              <BookmarkAction
                _id={_id}
                typeBookMark={type}
                className={'icon_overview_comments'}
                type={'icon'}
              />
            )}

            <ShareAction
              type="dropdown"
              title={post.title}
              content={post.content}
              url={shareUrl(post)}
            />
            {user?._id && (
              <>
                <Dropdown
                  overlayStyle={{ width: 100 }}
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="report"
                        onClick={() =>
                          typeLike == 'community'
                            ? setReportPopupCommunity({ opened: true, _id })
                            : setReportPopup({ opened: true, _id })
                        }
                      >
                        {t('common.report')}
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  getPopupContainer={(trigger) => trigger.parentElement}
                >
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CustomIcons type="dots-vertical" />
                  </a>
                </Dropdown>
              </>
            )}
          </Col>
        )}
      </Row>
    </div>
  );
}

OverViewComments.defaultProps = {
  typeLike: 'post',
  layout: 'list',
  showTopComment: false,
  from: '',
};

OverViewComments.propTypes = {
  likes: PropTypes.array,
  comments: PropTypes.array,
  showTopComment: PropTypes.bool,
  from: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateLikes: (publication) => dispatch(updateLikes(publication)),
    updateLikesCase: (publication) => dispatch(updateLikesCase(publication)),
    updateLikesCommunity: (publication) =>
      dispatch(updateLikesCommunity(publication)),
    setReportPopup: (data) => dispatch(setReportPopupAction(data)),
    setReportPopupCommunity: (data) =>
      dispatch(setReportPopupCommunityAction(data)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect, withUser, withAuthPopup)(OverViewComments);
