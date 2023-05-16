import React from 'react';
import CookieProvider from './CookieProvider';
import UserProvider from './User.context';
import AuthPopupProvider from './AuthPopup.context';

function AppProviders({ children }) {
  return (
    <CookieProvider>
      <UserProvider>
        <AuthPopupProvider>{children}</AuthPopupProvider>
      </UserProvider>
    </CookieProvider>
  );
}

export { AppProviders };
export default AppProviders;
