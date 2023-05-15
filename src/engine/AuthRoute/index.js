import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { UserContext } from 'appContext/User.context';
import { getObjId } from 'utils/generalHelper';
import { getRedirectUrl } from '../../utils/getRedirectUrl';

function AuthRoute({ component: Component, ...rest }) {
  // import styled from 'styled-components';

  const user = useContext(UserContext);
  // TODO: remover currentUser from localstorage and use user context
  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));

  let isConnected = false;
  let isApp = false;
  // if (process.env.NODE_ENV === 'production') {

  if (Capacitor.platform !== 'web') {
    isApp = true;
  }
  // If we have a token, consider the user to be signed in
  if (currentUser) {
    isConnected = true;
  }

  const hasAccess = props => {
    const industryPartnerAccess = [
      'community/detail',
      'notifications',
      'chat',
      'case/detail',
    ];
    const hasIndustryPathAccess = industryPartnerAccess.some(access =>
      props.location.pathname.includes(access),
    );
    const urlPathname = window.location.pathname;
    const initialId = urlPathname.split('community/detail/').pop();

    if (Capacitor.platform !== 'web') {
      if (props.location.pathname.includes('/event/detail')) {
        // console.debug('screen unlock');
        window.screen.orientation.unlock();
      } else {
        // console.debug('screen lock');
        window.screen.orientation.lock('portrait');
      }
    }

    const industryCommunityId =
      user?.employment && getObjId(user?.employment?.industryCommunity);

    const anothorizedAccess = [
      'community/detail',
      'notifications',
      'chat',
      'profile',
    ];

    if (currentUser?.role == 'industry') {
      // TODO: return to exact community with id. need to find id of the community
      const industryCommunityId =
        user?.employment && getObjId(user?.employment?.industryCommunity);

      if (!hasIndustryPathAccess) {
        return (
          <Redirect
            to={{
              pathname:
                initialId != industryCommunityId ||
                initialId == industryCommunityId ||
                industryCommunityId
                  ? `/community/detail/${industryCommunityId}`
                  : '/community/detail',
              search: '',
            }}
          />
        );
      } else {
        if (initialId != industryCommunityId || !industryCommunityId) {
          <Redirect
            to={{
              pathname: industryCommunityId
                ? `/community/detail/${industryCommunityId}`
                : '/community/detail',
              search: '',
            }}
          />;
        } else {
          return <Component {...props} />;
        }
      }
    } else if (
      props.location.pathname.includes('/community/detail') &&
      !currentUser
    ) {
      // TODO : check if user is inside community
      return <Redirect to={{ pathname: `/community` }} />;
    } else if (
      !user?._id &&
      anothorizedAccess.some(access => props.location.pathname.includes(access))
    ) {
      const redirectUrl = getRedirectUrl();

      if (Capacitor.platform !== 'web') {
        Browser.open({ url: redirectUrl });
        // window.location.href = redirectUrl;
      } else {
        window.location.href = redirectUrl;
      }
    }

    return <Component {...props} />;
  };

  return (
    <>
      {isApp === false && ( // for web app
        <Route exact={true} {...rest} render={props => hasAccess(props)} />
      )}
      {isApp === true && ( // for mobile app app
        <Route
          exact={true}
          {...rest}
          render={props =>
            isConnected === true ? (
              hasAccess(props)
            ) : (
              <Redirect to={{ pathname: '/login' }} />
            )
          }
        />
      )}
    </>
  );
}

AuthRoute.propTypes = {};

export default AuthRoute;
