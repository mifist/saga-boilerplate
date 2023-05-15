import React, { useEffect } from 'react';

export const AuthPopupContext = React.createContext();

export const AuthPopupProvider = ({ children }) => {
  const [authPopup, setAuthPopup] = React.useState({ open: false });

  return (
    <AuthPopupContext.Provider value={{ authPopup, setAuthPopup }}>
      {children}
    </AuthPopupContext.Provider>
  );
};

export const withAuthPopup = Component => props => (
  <AuthPopupContext.Consumer>
    {({ setAuthPopup }) => {
      return <Component setAuthPopup={setAuthPopup} {...props} />;
    }}
  </AuthPopupContext.Consumer>
);
