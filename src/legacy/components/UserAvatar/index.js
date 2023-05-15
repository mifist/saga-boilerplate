import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { Avatar } from 'antd';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// icons
import { UserOutlined } from '@ant-design/icons';

// global user
import { withUser } from 'appContext/User.context';

function UserAvatar({ user, width, height, fontSize, className, ...rest }) {
  const { isMobile } = useDeviceDetect();
  const childClassNames = classNames('user-photo', className);
  const defWidth = width || 65;
  const defHeight = height || 65;
  const defFontSize = fontSize || 12;

  const userInitials =
    user &&
    user.description?.firstname &&
    user.description?.lastname &&
    user.description?.firstname.charAt(0) +
      user.description?.lastname.charAt(0);
  const userDefImage = (
    <span
      style={{
        width: `${defWidth}px`,
        minWidth: `${defWidth}px`,
        height: `${defHeight}px`,
        fontSize: `${defFontSize}px`,
      }}
      className="emptyImage"
    >
      {userInitials}
    </span>
  );

  return user ? (
    <div className={childClassNames}>
      {user?.image ? (
        <Avatar className="photo" size={defWidth} src={user.image} />
      ) : user.description?.firstname && user.description?.lastname ? (
        userDefImage
      ) : (
        <Avatar size={defWidth} icon={<UserOutlined />} />
      )}
    </div>
  ) : (
    <div className={childClassNames}>
      <Avatar size={defWidth} icon={<UserOutlined />} />
    </div>
  );
}

UserAvatar.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default compose(
  withUser,
  memo,
)(UserAvatar);
