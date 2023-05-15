import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

const CommentDateTime = ({ visibility, dateTime, className }) => {
  const childClassNames = classNames('comment-date-time', className);
  return visibility && dateTime && (
    <span className={childClassNames}>{moment(dateTime).fromNow()}</span>
  );
};

CommentDateTime.defaultProps = {
  visibility: true
};
CommentDateTime.propTypes = {
  visibility: PropTypes.bool,
  comment: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired
  ])
};

export default memo(CommentDateTime);