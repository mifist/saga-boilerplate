import React, { useState } from 'react';

const CookieContext = React.createContext({});

const CookieProvider = ({ children }) => {
  const [cookies, setCookies] = useState({});

  const setCookie = (name, value, options = {}) => {
    const cookieOptions = {
      path: '/',
      ...options,
    };

    document.cookie = `${name}=${value}; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;
    setCookies({ ...cookies, [name]: value });
  };

  const getCookie = (name) => {
    if (!cookies[name]) {
      const cookieValue = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${name}=`));

      if (cookieValue) {
        setCookies({
          ...cookies,
          [name]: cookieValue.split('=')[1],
        });
      }
    }

    return cookies[name] || '';
  };

  return (
    <CookieContext.Provider value={{ setCookie, getCookie }}>
      {children}
    </CookieContext.Provider>
  );
};

export default CookieProvider;