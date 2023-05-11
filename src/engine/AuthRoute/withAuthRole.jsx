import React from 'react';

const withAuthRole = (Component, roles) => {
  return props => {
    const localUser = JSON.parse(localStorage.getItem(`${process.env.BASE_NAME}_user`));
    if (!!localUser?.token && !!roles.includes(localUser?.role)) {
      return <Component {...props} />;
    } else {
      return <></>;
    }
  };
};

withAuthRole.defaultProps = {
  roles: ['parent', 'teacher', 'admin'],
};


export default withAuthRole;