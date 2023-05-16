import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// icons
import CustomIcons from 'legacy/components/CustomIcons';

const GoBackButton = ({ goTo, label, className, ...rest }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  //const location = useLocation();

  const childClassNames = classNames(
    'main-single__go-back',
    className,
    i18n.language === 'ar' && 'main-single__go-back--rtl',
  );

  // IF the route name back was define
  // Of default Go Back
  const onClickPrev = (e) => {
    e.preventDefault();
    if (location?.state?.goBackName === 'Back to cases') {
      navigate('/case');
    } else if (location?.state?.goBackName === 'Back to articles') {
      navigate('/article');
    } else if (location?.state?.goBackName === 'Back to podcasts') {
      navigate('/podcast');
    } else {
      if (!location?.state?.goBackName) {
        navigate('/newsfeed');
      } else {
        location?.state?.notifications
          ? navigate('/notifications')
          : navigate(-1);
      }
    }
  };

  return (
    <a onClick={onClickPrev} className={childClassNames} {...rest}>
      <CustomIcons type="arrow-left" />
      {t(history.location?.state?.goBackName) || t('common.goToFeed')}
    </a>
  );
};

GoBackButton.propTypes = {
  goTo: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default GoBackButton;
