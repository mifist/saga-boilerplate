import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { convert } from 'html-to-text';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

// antd component
import { Menu, Dropdown, notification } from 'antd';

// icons
import CustomIcons from 'legacy/components/CustomIcons';
import { ReportPopup } from 'legacy/components/ReportPopup';

// global user
import { withUser } from 'engine/context/User.context';

// Async call for managing of users
import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';
import useAsync from 'appHooks/useAsync';

const CommentMenu = ({
  user,
  visibility,
  comment,
  post,
  onClick,
  className,
}) => {
  const { t } = useTranslation();

  const { isSuccess, run, data, isLoading } = useAsync();

  const [isReportPopupOpened, setIsReportPopupOpened] = useState(false);
  const location = useLocation();

  // User Authorization
  if (user._id) {
    const local = localStorage.getItem('beemed_user');
    const json = JSON.parse(local);
    setAuthorizationHeader(json?.token);
  }

  const childClassNames = classNames(`comment-menu-actions`, className);

  const community = (post && post?.community) || null;

  const isAuthorPost = post && post?.author?.some(e => e?._id === user?._id);

  const isAuthor = useMemo(() => user?._id == comment?.author?._id, [
    user._id,
    comment?.author?._id,
  ]);

  const isAuthorizedToDelete = useMemo(() => {
    let isAuthorized = false;
    if (
      community &&
      (community?.admins.includes(user?._id) ||
        community?.moderators.includes(user?._id))
    ) {
      isAuthorized = true;
    } else {
      isAuthorized = isAuthor;
    }
    return isAuthorized;
  }, [community?._id, user._id, isAuthor]);

  const handleHideOrShowCommentClick = useCallback(() => {
    if (user?._id) {
      if (!isLoading) {
        run(
          api.users.hideOrShowComment({
            userId: user?._id,
            commentId: comment._id,
            status: 'hide',
          }),
        );
      } else {
        notification.info({
          description: t('common.pendingRequest'),
        });
      }
    }
  }, [user?._id, comment._id]);

  const handleReportCommentSubmit = values => {
    if (user?._id) {
      if (!isLoading) {
        run(
          api.comments.reportComment({
            commentText: convert(comment?.content, {
              wordwrap: false,
              preserveNewlines: true,
              selectors: [{ selector: 'a', options: { ignoreHref: true } }],
            }).substring(0, 100),
            userEmail: user?.email,
            userFullName:
              user?.description?.firstname + ' ' + user?.description?.lastname,
            reportType: values.reportType,
            reportContent: values.reportContent,
            date: moment().format('YYYY-MM-DD'),
            userId: user?._id,
            commentId: comment._id,
            url: location.pathname,
          }),
        );
      } else {
        notification.info({
          description: t('common.pendingRequest'),
        });
      }
    }
  };

  useEffect(() => {
    if (data && isSuccess) {
      if (data?.data?.data) {
        notification.success({ message: data.data.data });
        setIsReportPopupOpened(false);
      } else {
        user.authLocalUser();
      }
    }
  }, [data]);

  return (
    visibility &&
    comment &&
    user?._id && (
      <>
        <Dropdown
          className={childClassNames}
          overlay={
            <Menu onClick={onClick}>
              {isAuthor && <Menu.Item key="edit">{t('common.edit')}</Menu.Item>}
              {isAuthorizedToDelete && (
                <Menu.Item key="delete">{t('common.delete')}</Menu.Item>
              )}
              {isAuthorPost && (
                <Menu.Item key="highlight">
                  {t(
                    `common.${
                      comment?.highlighted
                        ? 'unhighlightComment'
                        : 'hightlightComment'
                    }`,
                  )}
                </Menu.Item>
              )}
              <Menu.Item
                key="report"
                onClick={() => setIsReportPopupOpened(true)}
              >
                {t('common.report')}
              </Menu.Item>
              {user?._id && (
                <Menu.Item key="hide" onClick={handleHideOrShowCommentClick}>
                  {t('common.hideComment')}
                </Menu.Item>
              )}
            </Menu>
          }
          getPopupContainer={trigger => trigger.parentElement}
          trigger={['click']}
        >
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <CustomIcons type="dots-vertical" />
          </a>
        </Dropdown>
        <ReportPopup
          visible={isReportPopupOpened}
          onClose={() => setIsReportPopupOpened(false)}
          onSubmit={handleReportCommentSubmit}
          loading={isLoading}
        />
      </>
    )
  );
};

CommentMenu.defaultProps = {
  visibility: true,
};
CommentMenu.propTypes = {
  visibility: PropTypes.bool,
  comment: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  post: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default memo(withUser(CommentMenu));
