import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Capacitor Core
import { SplashScreen } from '@capacitor/splash-screen';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

// components
import AppUpdateProgress from 'components/AppUpdateProgress';

// Capacitor helper
import {
  isWeb,
  isAndroid,
  isIos,
  // Status Bar helper
  appStatusBar,
  // Bage helper
  appInfo,
  appUpdate,
  // notifications
  appPushNotifications
} from 'appCapacitor/helpers';

import PushNotificationsListener from 'appCapacitor/listeners/PushNotificationsListener';
import KeyboardListener from 'appCapacitor/listeners/KeyboardListener';
import AppCoreListener from 'appCapacitor/listeners/AppCoreListener';

// global user
import { useGetLocalUser } from 'engine/context/User.context';

function AppListener() {
  const history = useHistory();
  const getLocalUser = useGetLocalUser();

  if (!isWeb && ( isAndroid || isIos )) {
    //PushNotifications.removeAllDeliveredNotifications();
    window.screen.orientation.lock('portrait');
    // Keyboard.setScroll({ isDisabled: true });
    document.body.classList.remove('keyboard-did-show');
    // Show the splash for an indefinite amount of time:

    // resize body to total size less keyboard (allow scroll)
    // document.body.style.height = `${screenSize}px`;
    // const screenSize = document.body.offsetHeight;
  }

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadProgressShow, setDownloadProgressShow] = useState(false);
  
  useEffect(() => { 
    if (downloadProgress > 0) {
      setDownloadProgressShow(true);
    }
  }, [downloadProgress]);

  useEffect(() => {
    if (!isWeb && ( isAndroid || isIos )) {

      // Hide the splash (you should do this on app launch)
      SplashScreen.hide();

      // Set Status Bar
      appStatusBar.setupStatusBarListener();
      appStatusBar.setStatusBarBackgroundColor();

      /** 
       * START - UPDATE UPLICATION !!!
       */
      appUpdate.appIsReady();
      
      document.addEventListener('deviceready', function(event) {
        // Your code to use the CapacitorUpdater 
        // appUpdate.appIsReady();
        console.debug('App deviceready!', JSON.stringify(event));
      });

      // Show a progress bar to the user while the download is in progress
      CapacitorUpdater.addListener('download', (info) => {
      //  console.debug('download showDownloadProgress: ', downloadProgress, JSON.stringify(info))
    //    SplashScreen.show();
        appUpdate.appDownloading(info, setDownloadProgress);
       
      });
      // When the download is complete, show an alert
      CapacitorUpdater.addListener('downloadComplete', (bundle) => {
       // console.debug('download downloadComplete: ', JSON.stringify(bundle))
        setDownloadProgressShow(false);
        setDownloadProgress(0);
        appUpdate.appDownloadComplete(bundle);
      });
      // Listen for download fail event in the App, let you know when download has fail finished
      CapacitorUpdater.addListener('downloadFailed', (version) => {
        setDownloadProgressShow(false);
        setDownloadProgress(0);
        appUpdate.appDownloadFailed(version)
      });
      // Listen for no need to update event, usefull when you want force check every time the app is launched
      CapacitorUpdater.addListener('noNeedUpdate', (bundle) => appUpdate.appNoNeedUpdate(bundle));
      // Listen for availbale update event, usefull when you want to force check every time the app is launched
      CapacitorUpdater.addListener('updateAvailable', (bundle) => appUpdate.appUpdateAvailable(bundle));
      // Listen for download fail event in the App, let you know when download has fail finished
      CapacitorUpdater.addListener('appReloaded', (bundle) => {
    
        appUpdate.appReloadedCallback(bundle);

        // Re-init token for push notification
        const localUser = getLocalUser();
        if (localUser?._id) {
          appPushNotifications.registerPush(localUser._id);
        }
      });

      /** 
       * END - UPDATE UPLICATION !!!
       */

    }

  }, []);

  return !isWeb && ( isAndroid || isIos ) ? (
    <>
      <AppCoreListener />
      <PushNotificationsListener />
      <KeyboardListener />
      <AppUpdateProgress visibility={downloadProgressShow} progress={downloadProgress} />
    </>
  ) : <></>;
}

export default AppListener;