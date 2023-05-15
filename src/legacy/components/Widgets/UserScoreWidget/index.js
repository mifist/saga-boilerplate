/**
 *
 * UserScoreWidget
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import classNames from 'classnames';
// import { Link, useHistory } from 'react-router-dom';

// styles
import './style.scss';

// import useDeviceDetect from 'utils/useDeviceDetect';

// antd component
//import { Card } from 'antd';
//const { Meta } = Card;

// icons
//import CustomIcons from 'legacy/components/CustomIcons';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';

// global user
// import { withUser } from 'engine/context/User.context';

function UserScoreWidget({
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames(
    'user-score-widget',
    'profile-widget',
    className,
  );
  //const { isMobile } = useDeviceDetect();

  return <div className={childClassNames} />;
}

UserScoreWidget.defaultProps = {};
UserScoreWidget.propTypes = {};

export default memo(UserScoreWidget);
