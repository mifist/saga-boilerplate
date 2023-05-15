import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react';
import axios from 'axios';
import _find from 'lodash/find';

// utils
import api, { endpoint, setAuthorizationHeader } from 'appAPI/axiosAPI';
// hooks
import { useAsync, useDeviceDetect } from 'appHooks';
import history from 'utils/history';

// capacitor
import { appPushNotifications, getBaseApiUrl, isWeb, askCameraPermissions, askRecordAudioPermission } from 'appCapacitor/helpers';

const apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;

/**
 * Context for Notifications
 */
const initState = {
  _id: null,
  username: false,
  email: false,
  language: '',
  lastAction: '',
  description: false,
  address: false,
  image: false,
  role: false,
  userAuth: false,
  isTourFinished: false,
  registrationTokens: [],
  notifications: [],
  notificationsSetting: {
    pushNotification: true,
    emailNotification: true,
  },
  lastOpenedApp: '',
};
const reducer = (s, v) => ({ ...s, ...v });

const UserContext = createContext();
const UserDispatchContext = createContext();

export const useStateUser = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw Error('useStateUser must be call withing UserProvider');
  }
  return user;
};

export const useDispatchUser = () => {
  const setUser = useContext(UserDispatchContext);
  if (!setUser) {
    throw Error('useDispatchUser must be call withing UserProvider');
  }
  return setUser;
};

export const UserProvider = ({ children }) => {

  let UserProviderData = {};

  const [user, setUser] = useReducer(reducer, initState);
  const [token, setToken] = useState('');

  const [logOutTimer, setLogOutTimer] = useState(false);

  const { isLoading, isSuccess, run, data } = useAsync();
  const { isMobile } = useDeviceDetect();

  const publicPaths = ['/signupparent', '/reset', '/confirm', '/404'];

    // check if open page for online
  // if detail page => is on open page except community detail page
  UserProviderData.isPublicPath = useCallback(() => {
    const pathname = window.location.pathname;
    const isPath = publicPaths.some(p => pathname.includes(p));
    if (!!isPath) {
      return true;
    } else {
      return false;
    }
  }, []);

  UserProviderData.initUser = useCallback(async () => {
    const localUser = await UserProviderData.getLocalUser();
    if (!!localUser) {
      localStorage.setItem('logout', false);
      setToken(localUser?.token);
      setAuthorizationHeader(localUser?.token);
      if (!!localUser?._id) {
        run(api.users.getByID(localUser?._id));
      }
    } else {
      if (UserProviderData.isPublicPath()) {
        return false;
      } else {
        // history.push('/login');
      }

    }
  }, [history, localStorage]);

  // this useEffect runs only the first render
  useEffect(() => {
    UserProviderData.initUser();
    return () => {
      logOutTimer && clearTimeout(logOutTimer);
    }
  }, []);

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    if (isSuccess && data) {
     // console.debug('data', JSON.stringify(data))
      setUser(({ ...user, ...data }));
    }
  }, [data]);


  /**
   * User Core
   */
  UserProviderData.addToken = useCallback(token => setToken(token), []);

  UserProviderData.setAutorization = useCallback(auth => {
    setUser({ ...user, userAuth: auth ? true : false });
    auth && localStorage.setItem('logout', false);
  }, [setUser, user]);

  UserProviderData.isAuthenticated = useCallback(() => {
    const local = localStorage.getItem(`${process.env.BASE_NAME}_user`);
    let localUser = false;
    if (local !== null) {
      const localJson = JSON.parse(local);
      localUser = !!localJson?.token;
    }
    return localUser;
  }, []);

  UserProviderData.populateUser = useCallback(async userData => {
    setUser({ ...user, ...userData });
    console.debug('WEB - REGISTRATION');
    //console.debug('WEB - REGISTRATION:', isWeb, userData?.role, userData?.token);
    setAuthorizationHeader(userData?.token);

    if (!isWeb) {
      console.debug('Capacitor - REGISTRATION');
      askCameraPermissions();
      askRecordAudioPermission();
      appPushNotifications.registerPush(userData._id);
    }
  }, [user, isWeb]);

  UserProviderData.patchUser = useCallback(async userData => {
    if (!!userData?._id) {
      const userResult = await api.users.update(userData);
      if (userResult) {
        setUser(prev => ({ ...prev, ...userResult }));
      } else {
        console.error('patchUser Error');
      }
    } else {
      console.error('patchUser Error: inside userData don`t have "_id"');
    }
  }, [user]);


  /**
   * Local Data & Functions
   */
  UserProviderData.getLocalUser = useCallback(() => {
    const local = localStorage.getItem(`${process.env.BASE_NAME}_user`);
    const localData = local !== null && JSON.parse(local);
    return localData || false;
  }, []);

  UserProviderData.setCookie = useCallback(() => {
    document.cookie = "for=checkingDailyModal; expires=" + date.getTime() + (24 * 60 * 60 * 1000);
  }, []);

  UserProviderData.checkCookie = useCallback(() => {
    let cookie = document.cookie.split(";");
    if (cookie[0].split("=")[1] = "checkingDailyModal" && new Date().valueOf() >= new Date(cookie[1].split("=")[1]).valueOf()) {
      UserProviderData.setCookie();
    }
  }, []);


  /**
   * Other
   */
  UserProviderData.logOut = useCallback(() => {
    localStorage.setItem('logout', true);
    localStorage.removeItem(`${process.env.BASE_NAME}_user`);
    setUser(initState);

    const logOutTimer = setTimeout(function () {
      //window.location.href = '/login';
     //  history.push('/login');
    }, 0);
    setLogOutTimer(logOutTimer);

    return true;
  }, [setLogOutTimer]);




  /**
   * User Context ROOT
   */
  return (
    <UserContext.Provider value={{
      ...user,
      ...UserProviderData,
  
      // CUSTOM STATES
  
      // fech user data on init
      isLoading,
      isSuccess,
      // token
      token,
  
    }}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

/**
 * User Context HOOK
 */
export const withUser = Component => props => (
  <UserContext.Consumer>
    {store => <Component user={store} {...props} />}
  </UserContext.Consumer>
);


/**
 * User Context HOOK FUNCTIONS
 */

export function useSetUserData() {
  const user = useStateUser();
  const setUserD = useDispatchUser();
  return newUserData => {
    const newUser = { ...user, ...newUserData };
    setUserD(newUser);
  };
}

export function useUserPatchData() {
  const user = useStateUser();
  return newUserData => {
    const userId = newUserData?._id ? newUserData?._id : user?._id;
    return !!userId && user.patchUser({
      _id: userId,
      ...newUserData
    })
  };
}

export function useLogout() {
  const user = useStateUser();
 // const setUserD = useDispatchUser();
  return () => {
    return user.logOut();
  };
}

export function useGetLocalUser() {
  return () => {
    const local = localStorage.getItem(`${process.env.BASE_NAME}_user`);
    const localData = local !== null && JSON.parse(local);
    return localData || false;
  };
}

export function useInitUser() {
  const user = useStateUser();
  return () => user.initUser();
}