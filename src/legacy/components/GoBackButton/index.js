import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// icons
import CustomIcons from 'legacy/components/CustomIcons';

const GoBackButton = ({ goTo, label, className, ...rest }) => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  //const location = useLocation();

  const childClassNames = classNames(
    'main-single__go-back',
    className,
    i18n.language === 'ar' && 'main-single__go-back--rtl',
  );

  // IF the route name back was define
  // Of default Go Back
  const onClickPrev = e => {
    e.preventDefault();
    //console.log(history?.location?.state?.goBackName);
    if (history?.location?.state?.goBackName === 'Back to cases') {
      history.push('/case');
    } else if (history?.location?.state?.goBackName === 'Back to articles') {
      history.push('/article');
    } else if (history?.location?.state?.goBackName === 'Back to podcasts') {
      history.push('/podcast');
    } else {
      if (!history.location?.state?.goBackName) {
        history.push('/newsfeed');
      } else {
        history.location?.state?.notifications
          ? history.push('/notifications')
          : history.goBack();
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
