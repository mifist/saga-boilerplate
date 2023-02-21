import React from 'react';
import CookieProvider from './CookieProvider';

function AppProviders({ children }) {
  return (
    <CookieProvider>
      {children}
    </CookieProvider>
  );
}

export { AppProviders };
export default AppProviders;