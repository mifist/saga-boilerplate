import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// antd component
import { Space } from 'antd';

// icons
import CustomIcons from 'legacy/components/CustomIcons';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
import UserAvatar from 'legacy/components/UserAvatar';
import ConditionalLink from 'legacy/components/ConditionalLink';
import Badge from 'legacy/components/Badge';
import CommentDateTime from './CommentDateTime';

// utils
import { getObjId, getEmployment } from 'utils/generalHelper';

import { withAuthPopup } from 'appContext/AuthPopup.context';

const CommentAuthor = ({ user, setAuthPopup, view, comment, className }) => {
  const { t } = useTranslation();

  const childClassNames = classNames(
    `comment-author-section ${view}`,
    className,
  );

  const authorAvatarName = useMemo(() => {
    if (!comment?.author) {
      return (
        <div className="comment-author">
          <span className="name">Aucun auteur</span>
        </div>
      );
    }

    const isIndustryUser = comment?.author?.role == 'industry';
    const { isEmployee, industryName } = getEmployment(comment?.author);

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ConditionalLink
          condition={
            user?._id &&
            (user?.role !== 'industry' || comment.author.role !== 'industry')
          }
          onClick={() => setAuthPopup({ open: true })}
          to={
            comment.author.role === 'industry' && comment.author.employment
              ? `/community/detail/${getObjId(
                  comment.author.employment.industryCommunity,
                )}`
              : `/profile/${getObjId(comment?.author)}`
          }
          className="comment-author"
        >
          <Space>
            <UserAvatar user={comment?.author} width={32} height={32} />
            {comment?.author?.role == 'special' && (
              <CustomIcons type="verified" />
            )}
            <span className="name">
              {comment?.author?.description?.firstname}{' '}
              {comment?.author?.description?.lastname}
            </span>
            {isIndustryUser && (
              <span className="comment-author__badge industry">
                {t('communities.community-industryPartner')}
              </span>
            )}
          </Space>
        </ConditionalLink>
        {isEmployee && (
          <Badge
            title={t('communities.employeeOf', { industryName })}
            className="badge-container"
          />
        )}
      </div>
    );
  }, [comment?.author, comment?.author?._id]);

  const simpleView = useMemo(
    () => (
      <div className={`comment-author-info ${childClassNames}`}>
        {authorAvatarName}
        <span className="comment-author-score" />
        <span className="comment-author-physician" />
      </div>
    ),
    [comment?._id, comment?.author?._id],
  );

  const headerView = useMemo(
    () => (
      <span className={`ant-comment-content-author ${childClassNames}`}>
        <div className="comment-author-info">
          {authorAvatarName}
          <span className="comment-author-score" />
          <span className="comment-author-physician">{comment?.title}</span>
        </div>
        <span className="ant-comment-content-author-time">
          <CommentDateTime dateTime={comment?.createdAt} />
        </span>
      </span>
    ),
    [comment?._id, comment?.author?._id],
  );

  return comment && (view == 'header' ? headerView : simpleView);
};

CommentAuthor.defaultProps = {
  view: 'simple',
};
CommentAuthor.propTypes = {
  view: PropTypes.oneOf(['simple', 'header']).isRequired,
  comment: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  user: PropTypes.object,
};

export default memo(withAuthPopup(CommentAuthor));
