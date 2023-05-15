import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

// antd component
import { Tooltip } from 'antd';
// components
import CustomIcons from 'legacy/components/CustomIcons';


const Badge = ({ className, title, tooltipProps }) => {
  const mainClassName = classNames('badge', className);

  return (
    <Tooltip
      placement="top"
      title={title}
      trigger="click"
      getPopupContainer={trigger => trigger.parentElement}
      onClick={e => e.stopPropagation()}
      mouseLeaveDelay={0}
      overlayClassName="tooltip-container"
      {...tooltipProps}
    >
      <div className={mainClassName} onClick={e => e.stopPropagation()}>
        <CustomIcons type="badge" />
      </div>
    </Tooltip>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Badge;
