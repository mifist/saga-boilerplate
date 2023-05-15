/**
 *
 * UserCredentialsWidget
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// assets
import Stethoscope from 'images/icons/casestudy.svg';
import Map from 'images/icons/map.svg';
import Calendar from 'images/icons/calendar_blue.svg';

function UserCredentialsWidget({
  userInfo,
  isReady,
  loading,
  // default props
  className,
  ...rest
}) {
  const { t } = useTranslation();
  const childClassNames = classNames(
    'user-credentials-widget',
    'profile-widget',
    className,
  );
  //const { isMobile } = useDeviceDetect();

  return (
    userInfo && (
      <div className={childClassNames}>
        <div className={'profile-custom-card profile-credential'}>
          <p className={'profile-score-title'}>{t('profile.credentials')}</p>
          <span className={'profile-credentials-item'}>
            <img className={'profile-cre-icons'} src={Stethoscope} />
            {isReady && !loading && userInfo?.credential?.title !== ''
              ? userInfo?.credential?.title
              : t('profile.noInformation')}
          </span>

          <span className={'profile-credentials-item'}>
            <img className={'profile-cre-icons'} src={Map} />
            {isReady && !loading && userInfo.address?.city
              ? `${userInfo?.address?.city},  ${userInfo.address?.country}`
              : t('profile.noInformation')}
          </span>

          <span className={'profile-credentials-item'}>
            <img className={'profile-cre-icons'} src={Calendar} />
            {isReady && !loading && userInfo?.creationDate
              ? t('profile.joinedIn', {
                  date: moment(userInfo?.creationDate).format('MMMM YYYY'),
                })
              : t('profile.joinedInRecently')}
          </span>
        </div>
      </div>
    )
  );
}

UserCredentialsWidget.defaultProps = {
  isReady: true,
  loading: false,
};
UserCredentialsWidget.propTypes = {
  userInfo: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default memo(UserCredentialsWidget);
