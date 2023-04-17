import { useEffect, useState } from 'react';

const useAuthRole = roles => {
  const [isAllowed, setIsAllowed] = useState(false);
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('sagaboilerplate_user'));
    if (roles.includes(localUser?.role)) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  }, [roles]);
  return isAllowed;
};

useAuthRole.defaultProps = {
  roles: ['admin'],
};

export default useAuthRole;