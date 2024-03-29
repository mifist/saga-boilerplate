import React from 'react';
import CookieProvider from './CookieProvider';
import { UserProvider } from './User.context';

function AppProviders({ children }) {
  return (
    <CookieProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </CookieProvider>
  );
}

export { AppProviders };
export default AppProviders;