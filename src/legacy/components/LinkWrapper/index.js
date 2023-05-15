/**
 *
 * LinkWrapper
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function LinkWrapper({
  children,
  type,
  _id = null,
  goBackName = null,
  isCommunity = null,
  extraParams,
  className,
  custom,
}) {
  const childClassNames = classNames('link-wrapper', className);
  let search = '';
  const routeName = () => {
    // If no id go to overview
    if (_id === null) {
      switch (type) {
        case 'article':
        case 'articles':
          return `/article`;
        case 'post':
        case 'posts':
          return isCommunity ? `/community/detail/${isCommunity}` : `/`;
        case 'case':
        case 'cases':
          search = '?tab=cases';
          return isCommunity ? `/community/detail/${isCommunity}` : `/case`;
        case 'event':
        case 'events':
          return `/event`;
        case 'podcast':
        case 'podcasts':
          return `/podcast`;
        case 'community':
        case 'communities':
          return `/community`;
        case 'detail-community':
          search = '?tab=feed';
          return isCommunity
            ? `/community/detail/${isCommunity}`
            : `/community`;
      }
    } else {
      // if id go to detail
      switch (type) {
        case 'profile':
          return `/profile/${_id}`;
        case 'edit-profile':
          return `/account-preferences`;
        case 'article':
          return `/article/detail/${_id}`;
        case 'post':
        case 'case':
          return `/case/detail/${_id}`;
        case 'event':
          return `/event/detail/${_id}`;
        case 'podcast':
          return `/podcast/detail/${_id}`;
        case 'community':
          return `/community/detail/${_id}`;
      }
    }
  };

  return (
    <Link
      to={{
        pathname: routeName(),
        search: search,
        hash: extraParams?.hash,
        state: { goBackName, ...extraParams },
      }}
      className={childClassNames}
    >
      {children}
    </Link>
  );
}

LinkWrapper.propTypes = {};

export default LinkWrapper;
