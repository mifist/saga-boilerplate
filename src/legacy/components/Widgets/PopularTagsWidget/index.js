/**
 *
 * PopularTagsWidget
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Tag, Empty } from 'antd';

function PopularTagsWidget({
  //main props
  tags,
  // actions
  setPopulatTag,
  openTab,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames(
    'popular-tags-wrapper',
    'popular-tags-widget',
    'community-widget',
    className,
  );
  const { t } = useTranslation();
  //const { isMobile } = useDeviceDetect();

  const oncTagClick = e => {
    if (e?.currentTarget?.id && setPopulatTag && setPopulatTag !== undefined) {
      const name = e.currentTarget.id;
      setPopulatTag(name);
    }
    openTab !== undefined && openTab('feed');
  };

  return (
    <div className={childClassNames} {...rest}>
      {tags?.map(tagInfo => (
        <Tag
          className="popular-tags-widget__item"
          key={tagInfo?.tag?._id}
          id={tagInfo?.tag?.name}
          onClick={oncTagClick}
        >
          {tagInfo?.tag?.label}
        </Tag>
      ))}
      {(tags.length <= 0 || !tags) && (
        <Empty description={t('communities.noTags')} />
      )}
    </div>
  );
}

PopularTagsWidget.defaultProps = {};
PopularTagsWidget.propTypes = {
  tags: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  setPopulatTag: PropTypes.func,
  openTab: PropTypes.func,
};

export default memo(PopularTagsWidget);
