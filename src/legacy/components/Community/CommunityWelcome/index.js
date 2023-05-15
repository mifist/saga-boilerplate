import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { Typography } from 'antd';

const CommunityWelcome = ({ showDescription = true, className }) => {
  const { t } = useTranslation();
  const childClassNames = classNames('communities--welcome', className);

  return (
    <div className={childClassNames}>
      <Typography.Title level={3} className="communities--welcome__header">
        {t('communities.communityWelcome')}
      </Typography.Title>
      <div className="communities--welcome__content">
        {showDescription && (
          <>
            <Typography.Paragraph>
              {t('communities.communityWelcomeDesc1')}
            </Typography.Paragraph>
            <Typography.Paragraph>
              {t('communities.communityWelcomeDesc2')}
            </Typography.Paragraph>
          </>
        )}
        <Typography.Paragraph>
          {t('communities.interestedCommunity')}
          <Typography.Link href="mailto:info@beemed.com" className="email-link">
            info@beemed.com
          </Typography.Link>
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default memo(CommunityWelcome);
