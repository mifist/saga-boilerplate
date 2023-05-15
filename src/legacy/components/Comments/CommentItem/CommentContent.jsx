import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// icons
import { CheckOutlined } from '@ant-design/icons';

import { withAuthPopup } from 'appContext/AuthPopup.context';
import { withUser } from 'appContext/User.context';

import CommentFilePreview from 'legacy/components/Comments/CommentFilePreview';

const CommentContent = ({
  comment,
  showContent,
  contentBelow,
  setAuthPopup,
  user,
}) => {
  const { t } = useTranslation();
  const contentRef = useRef();

  const changeLinkTagClick = child => {
    if (child) {
      [...child.children].map(child1 => {
        if (child1 && child1.href) {
          if (child1.href.includes('profile')) {
            child1.href = 'javascript:void(0)';
            child1.onclick = () => setAuthPopup({ open: true });
          }
        } else {
          changeLinkTagClick(child1);
        }
      });
    }
  };

  useEffect(() => {
    if (!user?._id) {
      [...contentRef.current.children].map(child => changeLinkTagClick(child));
    }
  }, [comment, user]);

  return (
    <>
      {showContent && (
        <div>
          {comment?.highlighted && (
            <span className="highlighted-comment">
              <CheckOutlined /> {t('common.hightlightedComment')}
            </span>
          )}
          <div
            className="conten-comment"
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: comment?.content }}
          />
          {comment.pictures?.length > 0 && (
            <CommentFilePreview
              fileUrl={comment.pictures[0]}
              loading={false}
              className="from-content"
            />
          )}
        </div>
      )}
      {contentBelow}
    </>
  );
};

export default memo(withUser(withAuthPopup(CommentContent)));
