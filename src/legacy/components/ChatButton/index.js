/**
 *
 * ChatButton
 *
 */

import React, { memo } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// styles
import './style.scss';

// icons
import CustomIcons from 'legacy/components/CustomIcons';

// global user
import { withUser } from 'appContext/User.context';

// helpers function
import { getObjId } from 'utils/generalHelper';


function ChatButton({
  mode,
  visibility,
  memberID,
  user,
  // default props
  className,
}) {
  const childClassNames = classNames('chat-button', mode, className);

  return memberID && (getObjId(user) != getObjId(memberID)) && visibility && (
    <Link className={childClassNames} to={`/chat/users/${getObjId(memberID)}`}>
      <CustomIcons type="chat" /> { mode == 'default' && 'Message' }
    </Link>
  );
}

ChatButton.defaultProps = {
  mode: 'default',
  visibility: true,
};
ChatButton.propTypes = {
  mode: PropTypes.oneOf(['small', 'default']).isRequired,
  visibility: PropTypes.bool.isRequired,
  memberID: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired
  ])
};

export default compose(
  memo,
  withUser,
)(ChatButton);
