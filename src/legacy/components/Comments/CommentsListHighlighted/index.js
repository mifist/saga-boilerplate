import React, { memo, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

// components
import CommentItem from 'legacy/components/Comments/CommentItem';

function CommentsListHighlighted({
  // main props
  commnetsList,
  commentType,
  initProps,
  // default
  className,
}) {
  const childClassNames = classNames(
    `comments-list-section`,
    commentType,
    className,
  );

  const [expandedAction, setExpandedAction] = useState({
    id: null,
    expandType: 'reply',
    expandValue: false,
  });

  const expandCallback = useCallback((id, expandType, expandValue) => {
    if (expandedAction?.id == id) {
      setExpandedAction(prevState => ({
        ...prevState,
        expandType,
        expandValue,
      }));
    } else {
      setExpandedAction({
        id,
        expandType,
        expandValue,
      });
    }
  }, []);

  const renderMemo = useMemo(() => {
    return commnetsList?.map(comment => (
      <CommentItem
        key={comment._id}
        comment={comment}
        canReply={false}
        commentType={commentType}
        commentProps={initProps}
        expandCallback={expandCallback}
        expandedAction={expandedAction}
      />
    ));
  }, [commnetsList, expandedAction]);

  return <div className={childClassNames}>{renderMemo}</div>;
}

CommentsListHighlighted.defaultProps = {
  commnetsList: [],
};

CommentsListHighlighted.propTypes = {};

export default memo(CommentsListHighlighted);
