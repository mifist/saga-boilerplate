import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// styles
import './style.scss';

const SidebarAuthorsList = ({ persons, className }) => {
  const { t } = useTranslation();
  const childClassNames = classNames(
    'sidebar-item sidebar-authors-list',
    className,
  );

  return (
    persons && (
      <div className={childClassNames}>
        <h4 className="sidebar-title">{t('articles.authors')}</h4>
        <div>{persons}</div>
      </div>
    )
  );
};

export default SidebarAuthorsList;
