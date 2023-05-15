import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { useTranslation } from 'react-i18next';
// styles
import './style.scss';

const ReadMore = ({ length, className, children, ...rest }) => {
  const childClassNames = classNames(`read-more-content`, className);
  const { t } = useTranslation();
  const defaultLength = length ? length : 65;
  const [isHidden, setIsHidden] = useState(true);

  return (
    children && (
      <div className={childClassNames} {...rest}>
        {isHidden ? (
          <HTMLEllipsis
            unsafeHTML={children}
            maxLine="3"
            ellipsis="..."
            basedOn="letters"
          />
        ) : (
          <div
            className={`read-more-content__text ${
              isHidden ? 'line-clamp-4 more-content' : 'less-content'
            }`}
            dangerouslySetInnerHTML={{
              __html: children,
            }}
          />
        )}

        {children.length > defaultLength ? (
          <div className={'readmore-link'}>
            <span
              className="toggle-more-content"
              onClick={() => setIsHidden(!isHidden)}
            >
              {isHidden ? `...${t('common.seeMore').toLocaleLowerCase()}` : `...${t('common.showLess').toLocaleLowerCase()}`}
            </span>
          </div>
        ) : null}
      </div>
    )
  );
};

ReadMore.propTypes = {
  length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(ReadMore);
