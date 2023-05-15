/**
 *
 * EmptyFeed
 *
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// styles
import './style.scss';

// assets
import { InfoCircleOutlined } from '@ant-design/icons';

function EmptyFeed({
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('empty-feed-info', className);
  const { t } = useTranslation();
  //const { isMobile } = useDeviceDetect();

  return (
    <p className={childClassNames} {...rest}>
      <InfoCircleOutlined /> {t('common.noMore')}
    </p>
  );
}

EmptyFeed.defaultProps = {};
EmptyFeed.propTypes = {};

export default memo(EmptyFeed);
