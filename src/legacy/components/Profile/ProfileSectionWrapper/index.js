/**
 *
 * ProfileSectionWrapper
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

function ProfileSectionWrapper({
  mode,
  title,
  // default props
  className,
  children,
  ...rest
}) {
  const childClassNames = classNames('profile-section-wrapper', mode, className);

  return (
    <div className={childClassNames} {...rest}>
      {mode == 'default' && title && (
        <div className="profile-section-wrapper__title">
          <h3>{title}</h3>
        </div>
      )}
      <div className="profile-section-wrapper__context">{children}</div>
    </div>
  );
}

ProfileSectionWrapper.defaultProps = {
  title: 'Section Title',
  mode: 'simple'
};
ProfileSectionWrapper.propTypes = {
  mode: PropTypes.oneOf(['simple', 'default']).isRequired,
  title: PropTypes.string,
  children: PropTypes.any,
};

export default memo(ProfileSectionWrapper);
