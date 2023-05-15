import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { Card } from 'antd';

// component
import CustomIcons from 'legacy/components/CustomIcons';
import UserAvatar from 'legacy/components/UserAvatar';
import Badge from 'legacy/components/Badge';

// global user
import { withUser } from 'appContext/User.context';

import { getEmployment } from 'utils/generalHelper';

function ProfileCard({ user, ...rest }) {
  const { t, i18n } = useTranslation();
  const { isEmployee, industryName } = getEmployment(user);

  return (
    user && (
      <Card
        className={classNames(
          'profile-card',
          i18n.language === 'ar' && 'profile-card--rtl',
        )}
        {...rest}
      >
        <Card.Meta
          avatar={
            <div className="profile-card__photo">
              <UserAvatar width={85} height={85} fontSize={18} />
              {/*<Tag className="profile-card__badge">980</Tag>*/}
            </div>
          }
          title={
            <div className="profile-card__author">
              {user?.description?.firstname && user?.description?.lastname && (
                <span className="name">
                  {user.description.firstname} {user.description.lastname}
                </span>
              )}
              {isEmployee && (
                <Badge
                  title={t('communities.employeeOf', { industryName })}
                  tooltipProps={{ getPopupContainer: () => document.body }}
                />
              )}
              {user.role === 'special' && <CustomIcons type="verified" />}
            </div>
          }
          description={
            <>
              <span className="profile-card__description">
                {user?.credential?.title}
              </span>{' '}
              <Link className="profile-card__more" to={`/profile/${user._id}`}>
                {t('common.viewMyProfile')}
              </Link>
            </>
          }
        />
      </Card>
    )
  );
}

ProfileCard.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default compose(memo)(withUser(ProfileCard));
