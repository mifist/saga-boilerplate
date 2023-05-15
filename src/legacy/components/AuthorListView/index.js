/**
 *
 * AuthorListView
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// styles
import './style.scss';

//components
import UserAvatar from 'legacy/components/UserAvatar';

function AuthorListView({ author, className }) {
  const childClassName = classNames('author-list-view', className);

  return author && (
    <Link key={author?._id} className={childClassName} to={`/profile/${author?._id}`}>
      <div className='author-list-view__avatar'>
        <UserAvatar
          fontSize={12}
          user={author}
          width={56}
          height={56}
        />
      </div>
      <div className='author-list-view__content'>
        <h4 className='author-list-view__title'>
          {`${author.description.firstname} ${author.description.lastname}`}
        </h4>
        {author.credential.title && (
          <div
            className='author-list-view__description'
            dangerouslySetInnerHTML={{ __html: author.credential.title }}
          />
        )}
      </div>
    </Link>
  );
}

AuthorListView.propTypes = {
  author: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default memo(AuthorListView);
