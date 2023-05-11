import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { App } from '@capacitor/app';

import { Browser } from '@capacitor/browser';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import queryString from 'query-string';
//import queryString from 'query-string';


import {
  // Bage helper
  appBage
} from 'appCapacitor/helpers';

import {
  appStatusBarListener,
  setupKeyboardListener,
  setupPushNotificationsListener,
  coreListener,
} from 'appCapacitor/listeners';


function AppListener() {

  const screenSize = document.body.offsetHeight;

  //PushNotifications.removeAllDeliveredNotifications();
  window.screen.orientation.lock('portrait');
  // Keyboard.setScroll({ isDisabled: true });
  document.body.classList.remove('keyboard-did-show');
  // Show the splash for an indefinite amount of time:

  // resize body to total size less keyboard (allow scroll)
  // document.body.style.height = `${screenSize}px`;


  useEffect(() => {

    // console.debug('GET screenSize: ', JSON.stringify(screenSize));

    appStatusBarListener.setupStatusBarListener();
    
  /*  const bageAmount = appBage.getBadgeCount();
    console.debug('GET bageAmount: ', JSON.stringify(bageAmount)); */
    //  appBage.clearBadge();

    // Hide the splash (you should do this on app launch)
    SplashScreen.hide();

    // Listen for changes in the App’s active state (whether the app is in the foreground or background)
    App.addListener('appStateChange', state => {
      if (state.isActive) {

        appStatusBarListener.setStatusBarBackgroundColor();

        coreListener.setupAppUser();

        PushNotifications.getDeliveredNotifications().then(result => {
          const notifications = result?.notifications;
          appBage.setBadgeCount(notifications?.length);
         /*  console.debug(
            'Push getDeliveredNotifications',
            JSON.stringify(result),
          ); */
        });

      } else {
        console.debug('App has become inactive');
      }
    });

    App.addListener('appRestoredResult', data => {
      // console.debug('Restored state (appRestoredResult):', JSON.stringify(data));
    });

    // Hide the splash (you should do this on app launch)
    App.addListener('appUrlOpen', URLOpenListenerEvent => {
     //  console.debug('GET NEW URL OPENED', URLOpenListenerEvent);
      const url = coreListener.getAppUrlOpen(URLOpenListenerEvent)
      history.push(url);
    });

    App.addListener('backButton', (data) => {
     //  console.log('APP back button click:', JSON.stringify(data));
      if (data.canGoBack) {
        window.history.back();
      } else {
        // Maybe show alert before closing app?
        App.exitApp();
      }
    });

    /** 
     * PushNotifications Listener
     */
    setupPushNotificationsListener();

    /** 
     * Keyboard Listener
     */
    setupKeyboardListener();
    
  }, []);

  return null;
}

export default AppListener;