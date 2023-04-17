import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import axios from 'axios';

import { FCM } from '@capacitor-community/fcm';
// utils
import { isAndroid, getBaseApiUrl } from './helper.capacitor';

const apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;
const baseURL = apiURL;

//console.debug('info baseURL: ' + JSON.stringify(baseURL));

/* const logDeviceInfo = async () => {
  const info = await Device.getInfo();
  // console.debug('info: ' + JSON.stringify(info));
  return info;
};

const logDeviceId = async () => {
  const id = await Device.getId();
  // console.debug('info id: ' + JSON.stringify(id));
  return id;
}; */

const isPushNotificationsAvailable = Capacitor.isPluginAvailable(
  'PushNotifications',
);

// Get FCM token instead the APN one returned by Capacitor
const registerPush = async userId => {
  // external required step
  // register for push
  await PushNotifications.requestPermissions();
  await PushNotifications.register();

  // Enable the auto initialization of the library
  FCM.setAutoInit({ enabled: true }).then(() =>
    console.log(`Auto init enabled`),
  );

  // Check the auto initialization status
  FCM.isAutoInitEnabled().then(r => {
    console.log('Auto init is ' + (r.enabled ? 'enabled' : 'disabled'));
  });

};

export default {
  isPushNotificationsAvailable,
  registerPush,
}