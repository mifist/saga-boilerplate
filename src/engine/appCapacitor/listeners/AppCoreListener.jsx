import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import { Browser } from '@capacitor/browser';
import { Toast } from '@capacitor/toast';

/*
import enviroment_args from 'scripts/enviroment_args';

console.debug('ROOT_PATH envKeys', JSON.stringify(enviroment_args)) */

// Bage helper
import {
  deviceInfo,
  appInfo,
  // Status Bar helper
  appStatusBar,
  // Bage helper
  appBage,
  askRecordAudioPermission,
  // update
  appUpdate,
} from 'appCapacitor/helpers';

import {
  useInitUser,
  useGetLocalUser,
  useUserPatchData,
  useGetInintNotReadComm,
  useCheckPushNotificationParameters,
} from 'appContext/User.context';

// utils
import { isDateBeforeToday } from 'utils/moment/moment.utils';

function AppCoreListener() {

  const history = useNavigate();

  const initUser = useInitUser();
  const getLocalUser = useGetLocalUser();
  const updateUser = useUserPatchData();
  const getInintNotReadComm = useGetInintNotReadComm();

  const setupAppUser = async () => {
    const localUser = getLocalUser();
    const newDate = new Date();

    initUser();

    if (localUser?._id) {
      const lastOpenedApp = localUser?.lastOpenedApp;
      const openedNotToday = !!lastOpenedApp && isDateBeforeToday(lastOpenedApp);
      console.debug('App lastOpenedApp', JSON.stringify(openedNotToday), lastOpenedApp);
      if (openedNotToday) {
        updateUser({
          _id: localUser?._id,
          lastOpenedApp: newDate,
        });

        /**
         * START - UPDATE UPLICATION !!!
         */
        await appUpdate.checkAndUpdateApp();
        /**
         * END - UPDATE UPLICATION !!!
         */

      }
    } else {
      const newUser = getLocalUser();
      newUser?._id &&
        updateUser({
          _id: newUser?._id,
          lastOpenedApp: newDate,
        });
    }

    await getInintNotReadComm();
  };

  const getAppUrlOpen = async (URLOpenListenerEvent) => {
    // Example url: https://beerswift.app/tabs/tab2

    const { url } = URLOpenListenerEvent;
    const code = url.split('oauth').pop();
    const slug = url.split(process.env.APP_URL).pop();

    if (url && url.includes('oauth')) {
      Browser.close();
      return `/oauth${code}`;
    } else if (url && url.includes('push-notification')) {
      const slug = url.split('push-notification').pop();
      /*   console.debug(
          'GET NEW URL Notification OPENED slug: ' + JSON.stringify(slug),
        ); */
      return slug;
    } else if (slug) {
      return slug;
    }
    // If no match, do nothing - let regular routing
    // logic take over

  };

  // Start the background task by calling `beforeExit`.
  const beforeExitCallback = async () => {
    const taskId = await BackgroundTask.beforeExit(async () => {
      // In this function We might finish an upload, let a network request
      // finish, persist some data, or perform some other task

      // Example of long task
      /*  let start = new Date().getTime();
      for (var i = 0; i < 1e18; i++) {
        if (new Date().getTime() - start > 20000) {
          break;
        }
      } */

      console.debug('APP BackgroundTask', JSON.stringify(taskId));

      // Finish the background task as soon as everything is done.
      // Must call in order to end our task otherwise
      // we risk our app being terminated, and possibly
      // being labeled as impacting battery life
      BackgroundTask.finish({ taskId });
    });
  };


  useEffect(() => {

    // Listen for changes in the App’s active state (whether the app is in the foreground or background)
    App.addListener('appStateChange', state => {
      const { isActive } = state;

      console.debug('App appStateChange', JSON.stringify(state));

      // The app state has been changed to active.
      if (isActive) {
        const localUser = getLocalUser();

        // Set Status Bar
        appStatusBar.setStatusBarBackgroundColor();

        setupAppUser();
        if (localUser?.token) {
          askRecordAudioPermission();
        }

      }

      // The app state has been changed to inactive.
      if (!isActive) {
        // The app has become inactive. We should check if we have some work left to do, and, if so,
        // execute a background task that will allow us to finish that work before the OS
        // suspends or terminates our app:
        beforeExitCallback();
      }

    });

    App.addListener('appRestoredResult', data => {
      console.debug('Restored state (appRestoredResult):', JSON.stringify(data));
    });

    // Hide the splash (you should do this on app launch)
    App.addListener('appUrlOpen', async URLOpenListenerEvent => {
      console.debug('GET NEW URL OPENED', URLOpenListenerEvent);
      const url = await getAppUrlOpen(URLOpenListenerEvent)
      navigate(url);
    });

    App.addListener('backButton', (data) => {
      console.log('APP back button click:', JSON.stringify(data));
      if (data.canGoBack) {
        window.history.back();
      } else {
        // Maybe show alert before closing app?
        App.exitApp();
      }
    });

  }, []);

  return <></>;

};

export default AppCoreListener;
