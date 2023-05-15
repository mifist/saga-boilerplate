/**
 *
 * OverviewInfoCard
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

// assets
import CustomIcons from 'legacy/components/CustomIcons';


function OverviewInfoCard({
  icon,
  title,
  content,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('overview-info-card-wrapper', className);

  return <div className={childClassNames}>
    {icon && <span className="card-icon">
      <CustomIcons type={icon} />
    </span>}
    <h3 className="card-title">
      {title}
    </h3>
    {content && <div className="card-content" dangerouslySetInnerHTML={{ __html: content }} />}

  </div>;
}

OverviewInfoCard.defaultProps = {
  icon: 'security'
};
OverviewInfoCard.propTypes = {
  icon: PropTypes.string,
  content: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default memo(OverviewInfoCard);
