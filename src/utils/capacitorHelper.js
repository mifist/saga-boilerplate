import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';

import {
  DEVELOPMENT_API_URL,
  STAGING_API_URL,
  PRODUCTION_API_URL,
  DEVELOPMENT_APP_API_URL,
} from 'utils/constants';

const isWeb = Capacitor.platform == 'web';
const isAndroid = Capacitor.platform == 'android';
const isIos = Capacitor.platform == 'ios';


const getBaseApiUrl = () => {
  /*
  const nodeENV = process.env.NODE_ENV,
    baseENV = process.env.BASE_ENV; */

  let apiURL = DEVELOPMENT_API_URL;

  if (isWeb && process.env.BASE_ENV === 'production') {
    if (window.location.origin.includes('app.beemed.com')) {
      apiURL = PRODUCTION_API_URL;
    } else {
      apiURL = STAGING_API_URL;
    }
  } else if (isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = STAGING_API_URL;
  } else if (isWeb && process.env.BASE_ENV === 'development') {
    apiURL = DEVELOPMENT_API_URL;
  }

/*   console.log({isWeb})
  console.log('process.env: ', process.env)
  console.log('process.env.BASE_ENV: ', process.env.BASE_ENV)
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)  */
  /*   console.debug('process.env.NODE_ENV: ', JSON.stringify(process.env.NODE_ENV))
  console.debug('process.env.BASE_ENV: ', JSON.stringify(process.env.BASE_ENV)) */

  if (!isWeb && process.env.BASE_ENV === 'production') {
    apiURL = PRODUCTION_API_URL;
  } else if (!isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = STAGING_API_URL;
  } else if (!isWeb && process.env.BASE_ENV === 'development') {
    apiURL = DEVELOPMENT_APP_API_URL;
  }

  // console.log('apiURL: ', apiURL)
  /*   console.debug('isWeb: ', JSON.stringify(isWeb))
  console.debug('apiURL: ', JSON.stringify(apiURL))  */
  return apiURL;
};

const getBaseDomainOrigin = () => {
  let apiURL = 'http://localhost:3000';

  if (isWeb && process.env.BASE_ENV === 'production') {
    apiURL = 'https://app.beemed.com';
  } else if (isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = 'https://beta.beemed.com';
  }

  if (!isWeb && process.env.BASE_ENV === 'production') {
    apiURL = 'https://app.beemed.com';
  } else if (!isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = 'https://beta.beemed.com';
  }

  return apiURL;
};

const askCameraPermissions = () => {
  Camera.checkPermissions()
    .then(result => {
      if (result?.camera !== 'granted' || result?.photos !== 'granted') {
        Camera.requestPermissions().then(result => {
          console.debug(
            'info Camera.requestPermissions: ' + JSON.stringify(result),
          );
        });
      }
    })
    .catch(error => console.log('info Camera Error: ' + JSON.stringify(error)));
};

const usePhotoGallery = () => {
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
  };

  return {
    takePhoto,
  };
};

const takePicture = async () => {
  const options = {
    quality: 90,
    // allowEditing: true,
    resultType: CameraResultType.Uri,
  };

  const originalPhoto = await Camera.getPhoto(options);

  // originalPhoto.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  let photoPath = originalPhoto.webPath;

  //console.debug('photoPath: ', JSON.stringify(photoPath));

  return photoPath;
};

/**
 * Push Notification
 */
const isPushNotificationsAvailable = Capacitor.isPluginAvailable(
  'PushNotifications',
);

const logDeviceInfo = async () => {
  const info = await Device.getInfo();
  // console.debug('info: ' + JSON.stringify(info));
  return info;
};

const logDeviceId = async () => {
  const id = await Device.getId();
  // console.debug('info id: ' + JSON.stringify(id));
  return id;
};

const registerPush = userId => {
  PushNotifications.checkPermissions().then(result => {
    //console.debug('PushNotifications GRANTED: ' + JSON.stringify(result));
    if (result.receive !== 'granted') {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          //console.debug('REGISTRATION GRANTED');
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register().then(value => {
            //console.debug(value);
          });
        }
      });
    }
  });

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError', error => {
    //console.debug(error);
  });

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration', async token => {
    // console.debug('REGISTRATION IN DB');

    await Device.getId().then(result => {
      // console.debug(result);
      const uuid = result.uuid;
      // console.debug('info id uuid: ' + JSON.stringify(uuid));

      const response = axios.post(
        apiURL + 'users/register',
        {
          _id: userId,
          token: token.value,
          uuid: uuid,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      //console.debug(JSON.stringify(response));
      //console.debug('My token: ' + JSON.stringify(token));
    });
  });

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived', notification => {
    //console.debug('Push received: ' + JSON.stringify(notification));
  });

  // Method called when tapping on a notification
  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    notification => {
      console.debug('Push action performed: ' + JSON.stringify(notification));
    },
  );
};
//
// console.debug(
//   'isPushNotificationsAvailable: ' +
//     JSON.stringify(isPushNotificationsAvailable),
// );

export {
  // core
  Capacitor,
  PushNotifications,
  Camera,
  Device,
  // custom
  isWeb,
  isAndroid,
  isIos,
  getBaseApiUrl,
  getBaseDomainOrigin,
  askCameraPermissions,
  usePhotoGallery,
  // push notif
  isPushNotificationsAvailable,
  logDeviceInfo,
  logDeviceId,
  registerPush,
};
