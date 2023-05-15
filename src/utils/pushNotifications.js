import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import axios from 'axios';

import { FCM } from '@capacitor-community/fcm';

import { getBaseApiUrl } from 'utils/capacitorHelper';
import { registerTokenCometChat } from './cometChatHelper';
import { CometChat } from '@cometchat-pro/chat';
import { isAndroid } from './capacitorHelper';

const apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;
const baseURL = apiURL;

//console.debug('info baseURL: ' + JSON.stringify(baseURL));

export const logDeviceInfo = async () => {
  const info = await Device.getInfo();
  // console.debug('info: ' + JSON.stringify(info));
  return info;
};

export const logDeviceId = async () => {
  const id = await Device.getId();
  // console.debug('info id: ' + JSON.stringify(id));
  return id;
};

export const isPushNotificationsAvailable = Capacitor.isPluginAvailable(
  'PushNotifications',
);
// console.debug(
//   'isPushNotificationsAvailable: ' +
//     JSON.stringify(isPushNotificationsAvailable),
// );

export const registerPush = userId => {
  PushNotifications.checkPermissions().then(res => {
    if (res.receive !== 'granted') {
      PushNotifications.requestPermissions().then(res => {
        if (res.receive === 'denied') {
          console.debug('PushNotifications is denied');
        } else {
          register(userId);
        }
      });
    } else {
      register(userId);
    }
  });
};

const register = userId => {

  // Register with Apple / Google to receive push via APNS/FCM
  PushNotifications.register();

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError', error => {
    // console.debug(error);
  });

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration', async token => {
    //console.debug('REGISTRATION IN DB');
    await Device.getId().then(async result => {
      // console.debug(result);
      const uuid = result.uuid;

      const FCM_TOKEN = await FCM.getToken().then(r => r.token);

      const response = await axios.post(
        baseURL + 'users/register',
        {
          _id: userId,
          token: token.value,
          uuid: uuid,
          fcm_token: FCM_TOKEN || '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      // console.debug(response);
      // console.debug('My token: ' + JSON.stringify(token));
    });
  });

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived', notification => {
    // console.debug('Push received: ' + JSON.stringify(notification));
  });

  // Method called when tapping on a notification
  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    notification => {
      // console.debug('Push action performed: ' + JSON.stringify(notification));
    },
  );
};
