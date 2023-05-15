/**
 *
 * WidgetWrapper
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

function WidgetWrapper({
  mode,
  title,
  // default props
  className,
  children,
  ...rest
}) {
  const childClassNames = classNames('widget-wrapper', mode, className);

  return (
    <div className={childClassNames} {...rest}>
      {mode == 'default' && (
        <div className="widget-wrapper__title">
          <h3>{title}</h3>
        </div>
      )}
      <div className="widget-wrapper__context">{children}</div>
    </div>
  );
}

WidgetWrapper.defaultProps = {
  title: 'Widget Title',
  mode: 'default'
};
WidgetWrapper.propTypes = {
  mode: PropTypes.oneOf(['simple', 'default']).isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};

export default memo(WidgetWrapper);
