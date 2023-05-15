import React from 'react';
import { Link } from 'react-router-dom';

function ConditionalLink({ children, condition, to, ...props }) {
  return !!condition && to ? (
    <Link to={to} {...props} style={{ cursor: 'pointer' }}>
      {children}
    </Link>
  ) : (
    <div style={{ cursor: 'pointer' }} {...props}>
      {children}
    </div>
  );
}

ConditionalLink.propTypes = {};

export default ConditionalLink;
