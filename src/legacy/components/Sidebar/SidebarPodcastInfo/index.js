import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Descriptions } from 'antd';

// icons

const SidebarPodcastInfo = ({ podcast, className, ...rest }) => {
  const { t } = useTranslation();

  const childClassNames = classNames(
    'sidebar-item sidebar-podcast-info',
    className,
  );

  return (
    podcast && (
      <div className={childClassNames} {...rest}>
        <h4 className="sidebar-title">{t('podcasts.aboutPodcast')}</h4>
        <Descriptions className="podcast-descriptions" title="">
          <Descriptions.Item label={t('common.published')}>
            {moment(podcast.date_creation).format('DD/MM/YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  );
};

SidebarPodcastInfo.propTypes = {
  podcast: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default SidebarPodcastInfo;
