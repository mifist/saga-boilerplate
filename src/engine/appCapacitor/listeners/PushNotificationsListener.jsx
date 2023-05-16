import React, { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { Device } from '@capacitor/device';
import axios from 'axios';

import { FCM } from '@capacitor-community/fcm';


// Bage helper
import {
  isAndroid,
  getBaseApiUrl,
  // Bage helper
  appBage
} from 'appCapacitor/helpers';

import {
  useInitUser,
  useGetLocalUser,
  useUserPatchData,
  useCheckPushNotificationParameters,
  useGetInintNotReadComm,
} from 'appContext/User.context';

const apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;
const baseURL = apiURL;

function PushNotificationsListener () {
  const history = useNavigate();
  const checkParentChild = useCheckPushNotificationParameters();

  useEffect(() => {

    // listener on registration accept for push
    PushNotifications.addListener('registration', async token => {

      const localUser = useGetLocalUser()();
      // Get FCM token instead the APN one returned by Capacitor
      let FCM_TOKEN = await FCM.getToken().then(r => r.token);
     // console.debug('FCM_TOKEN : ' + FCM_TOKEN);

      if (isAndroid) {
        console.debug('is android then : switch token APN');
        FCM_TOKEN = token.value;
      }

      // register the token on cometchat
      /*  try {
        CometChat.registerTokenForPushNotification(FCM_TOKEN).then(result => {
          console.debug(result);
        });
        // await CometChat.registerTokenForPushNotification(FCM_TOKEN);
      } catch (error) {
        console.error(error);
      } */

      // get the device id
      const uuid = await Device.getId().then(result => result.uuid);
    // console.debug('uuid : ' + uuid);

      // update the user with the corresponding token + uuid
      try {

        const res = await axios.post(
          baseURL + 'auth/register',
          {
            _id: localUser?._id,
            token: FCM_TOKEN,
            uuid: uuid,
            fcm_token: FCM_TOKEN || '',
          },
        );
      } catch (err) {
        console.debug('auth/register error', JSON.stringify(err));
      }

       // console.debug('PushNotifications registration: ', JSON.stringify(token));
      // console.debug('My token: ' + JSON.stringify(token));
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', error => {
      console.debug(error);
    });

    //PushNotifications.removeAllDeliveredNotifications();

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      notification => {
        PushNotifications.getDeliveredNotifications().then(result => {
          const notifications = result?.notifications;
          appBage.setBadgeCount(notifications?.length);
          /*  console.debug(
            'Push getDeliveredNotifications',
            JSON.stringify(notifications),
          ); */
        });
         // console.debug('Push received: pushNotificationReceived', JSON.stringify(notification));
      },
    );

    /*
      * Method called when tapping on a notification
      */
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      notification => {
       //  console.debug('pushed', JSON.stringify(notification));
       //  console.debug('Push action performed: hehe');

      /*    PushNotifications.getDeliveredNotifications().then(result => {
          const notifications = result?.notifications;
          appBage.setBadgeCount(notifications?.length);
            console.debug(
            'Push getDeliveredNotifications',
            JSON.stringify(notifications),
          );
        });  */

        const bageAmount = appBage.getBadgeCount();
      //   console.debug('GET bageAmount: ', JSON.stringify(bageAmount));

        let link = notification.notification.data.url;
        const search = link.split('?').pop();
        const params = queryString.parse(search);
        const slug = link.split('push-notification').pop();
       // console.debug('slug', slug);

        if (slug) {
          const notifParams = Object.assign(params, { notifAmount: bageAmount });
         /*  console.debug('redirect to detail', JSON.stringify(notifParams));*/
          console.debug('redirect to detail params', JSON.stringify(params));
          checkParentChild(params);
          if (!!params?.responseID && params?.childId) {
            navigate(`/communications/${params?.responseID}?childId=${params?.childId}&IDComm=${params?.responseID}&needRefresh=true`);
          } else if (!!params?.communicationId && !params?.childId) {
            navigate(`/communications/${params?.communicationId}?IDComm=${params?.communicationId}&needRefresh=true`);
          } else {
            navigate(slug);
          }

          appBage.decreaseBadge();
        } else {
          // console.debug('redirect to notifications');
          navigate('/notifications');
          appBage.decreaseBadge();
        }

      },
    );
  }, []);

  return <></>;
};

export default PushNotificationsListener;
