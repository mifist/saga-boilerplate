import { FCM } from '@capacitor-community/fcm';
import { PushNotifications } from '@capacitor/push-notifications';
import axios from 'axios';
import { Device } from '@capacitor/device';
import { getBaseApiUrl, isAndroid } from './capacitorHelper';
import { CometChat } from '@cometchat-pro/chat';
const apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;
const baseURL = apiURL;

// Get FCM token instead the APN one returned by Capacitor

export const registerPush = async userId => {
  // external required step
  // register for push
  await PushNotifications.requestPermissions();
  await PushNotifications.register();

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError', error => {
    //console.debug(error);
  });

  // Enable the auto initialization of the library
  FCM.setAutoInit({ enabled: true }).then(() =>
    console.log(`Auto init enabled`),
  );

  // Check the auto initialization status
  FCM.isAutoInitEnabled().then(r => {
    console.log('Auto init is ' + (r.enabled ? 'enabled' : 'disabled'));
  });

  // listener on registration accept for push
  PushNotifications.addListener('registration', async token => {
    // Get FCM token instead the APN one returned by Capacitor
    let FCM_TOKEN = await FCM.getToken().then(r => r.token);
    //console.debug('token : ' + FCM_TOKEN);

    if (isAndroid) {
      //console.debug('is android then : switch token APN');
      FCM_TOKEN = token.value;
    }
    // register the token on cometchat
    try {
      CometChat.registerTokenForPushNotification(FCM_TOKEN).then(result => {
        console.debug(result);
      });
      // await CometChat.registerTokenForPushNotification(FCM_TOKEN);
    } catch (error) {
      console.error(error);
    }

    // get the device id
    const uuid = await Device.getId().then(result => result.uuid);
    //console.debug('uuid : ' + uuid);

    // update the user with the corresponding token + uuid
    const response = await axios.post(
      baseURL + 'users/register',
      {
        _id: userId,
        token: FCM_TOKEN,
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

    //console.debug(response);
    // console.debug('My token: ' + JSON.stringify(token));
  });

  // Show us the notification payluuidoad if the app is open on our device
  // PushNotifications.addListener('pushNotificationReceived', notification => {
  //   console.debug('Push received: ' + JSON.stringify(notification));
  // });
  //
  // // Method called when tapping on a notification
  // PushNotifications.addListener(
  //   'pushNotificationActionPerformed',
  //   notification => {
  //     console.debug('Push action performed: ' + JSON.stringify(notification));
  //   },
  // );
};
