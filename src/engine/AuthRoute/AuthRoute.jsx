/**
 *
 * AuthRoute
 *
 */

import React, { useEffect, useCallback } from 'react';
import { Route, Redirect } from 'react-router-dom';
// Capacitor
import { Browser } from '@capacitor/browser';

// layouts
import AccessDenied from 'layouts/AccessDenied';

// utils
import { isWeb } from 'appCapacitor/helpers';
import useDeviceDetect from 'appHooks/useDeviceDetect';

// context
import { withUser } from 'appContext/User.context';

function AuthRoute({ user, roles, component: Component, children, ...rest }) {
  const localUser = JSON.parse(localStorage.getItem(`${process.env.BASE_NAME}_user`));
  const { logOut } = user;

  let width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  const { isMobile } = useDeviceDetect();

  let isApp = false;
  if (!isWeb || isMobile || width < 800) {
    isApp = true;
  }

  const publicPaths = ['/signupparent', '/reset', '/confirm'];

  // Log out from Desctop version if user role is not 'admin'
  useEffect(() => {
    if (
      !!localUser?.token &&
      !isApp &&
      !!localUser &&
      localUser?.role == 'parent'
    ) {
      logOut();
    }
  }, [isApp]);

  // check if open page for online
  // if detail page => is on open page except community detail page
  const isPublicPath = useCallback(() => {
    const pathname = window.location.pathname;
    const isPath = publicPaths.some(p => pathname.includes(p));
    if (!!isPath) {
      return true;
    } else {
      return false;
    }
  }, []);

  const hasAccsessByRole = useCallback(() => {
    if (roles.includes(localUser?.role)) {
      return true;
    } else {
      return false;
    }
  }, [roles, localUser?.role]);

  const RedirectExternal = () => {
    if (!isWeb) {
      Browser.open({ url: redirectUrl });
      // window.location.href = redirectUrl;
    } else {
      window.location.href = redirectUrl;
    }
    return null;
  };

  // If we have a token, consider the user to be signed in
  let isConnected = isPublicPath() || !!localUser?.token;

  return (
    <>
      {isApp === false && ( // for web app
        <Route
          exact={true}
          {...rest}
          render={props =>
            !!isConnected ? (
              hasAccsessByRole() || isPublicPath() ? (
                Component ? (
                  <Component roles={roles} {...props} />
                ) : (
                  children
                )
              ) : (
                <AccessDenied roles={roles} {...props} />
              )
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
          }
        />
      )}
      {isApp === true && ( // for mobile app app
        <Route
          exact={true}
          {...rest}
          render={props =>
            !!isConnected ? (
              hasAccsessByRole() || isPublicPath() ? (
                Component ? (
                  <Component roles={roles} {...props} />
                ) : (
                  children
                )
              ) : (
                <AccessDenied roles={roles} {...props} />
              )
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
          }
        />
      )}
    </>
  );
}

AuthRoute.defaultProps = {
  roles: ['admin'],
};

AuthRoute.propTypes = {};

export default withUser(AuthRoute);
