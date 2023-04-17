// appCapacitor/helper.capacitor.js
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
// Custom Voice recorder
import { VoiceRecorder } from 'capacitor-voice-recorder';


// utils
import {
  DEVELOPMENT_LOCAL_API_URL,
  DEVELOPMENT_LOCAL_APP_API_URL,
  DEVELOPMENT_API_URL,
  STAGING_API_URL,
  PRODUCTION_API_URL,
} from 'store/constants';

export const isWeb = Capacitor.platform == 'web';
export const isAndroid = Capacitor.platform == 'android';
export const isIos = Capacitor.platform == 'ios';

export const deviceInfo = async () => {
  return await Device.getInfo().then(result => result);
};
// return: name, id, build, varsion
export const appInfo = async () => {
  return await App.getInfo().then(result => result);
};
// return isActive or not
export const appGetState = async () => {
  return await App.getState().then(result => result);
};
export const appGetLanguageCode = async () => {
  return await Device.getLanguageCode().then(result => result);
};


export const getBaseApiUrl = () => {
  /* 
  const nodeENV = process.env.NODE_ENV,
    baseENV = process.env.BASE_ENV; */

  let apiURL = DEVELOPMENT_LOCAL_API_URL;

  // web
  if (isWeb && process.env.BASE_ENV === 'production') {
    if (window.location.origin.includes(process.env.APP_URL)) {
      apiURL = PRODUCTION_API_URL;
    } else {
      apiURL = STAGING_API_URL;
    }
  } else if ( isWeb && process.env.BASE_ENV === 'staging' || !isWeb && process.env.BASE_ENV === 'staging' ) {
    apiURL = STAGING_API_URL;
  } else if ( isWeb && process.env.BASE_ENV === 'development' || !isWeb && process.env.BASE_ENV === 'development' ) {
    apiURL = DEVELOPMENT_API_URL;
  } else if ( isWeb && process.env.BASE_ENV === 'local' ) {
    apiURL = DEVELOPMENT_LOCAL_APP_API_URL;
  }

  // app
  if (!isWeb && process.env.BASE_ENV === 'production') {
    apiURL = PRODUCTION_API_URL;
  } else if (!isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = STAGING_API_URL;
  } else if (!isWeb && process.env.BASE_ENV === 'development') {
    apiURL = DEVELOPMENT_API_URL;
  } else if (!isWeb && process.env.BASE_ENV === 'local') {
    apiURL = DEVELOPMENT_LOCAL_APP_API_URL;
  }
  
  console.log('apiURL: ', apiURL, process.env.API_URL);

  return process.env.API_URL;
};

export const getBaseDomainOrigin = () => {
  let apiURL = 'http://localhost:3000';

  if (isWeb && process.env.BASE_ENV === 'production') {
    apiURL = `https://app.${process.env.BASE_NAME}.com`;
  } else if (isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = `https://beta.${process.env.BASE_NAME}.com`;
  }

  if (!isWeb && process.env.BASE_ENV === 'production') {
    apiURL = `https://app.${process.env.BASE_NAME}.com`;
  } else if (!isWeb && process.env.BASE_ENV === 'staging') {
    apiURL = `https://beta.${process.env.BASE_NAME}.com`;
  }

  return apiURL;
};

export const askRecordAudioPermission = async () => {
  // will print true / false based on the ability of the current device (or web browser) to record audio
  const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
  console.debug('canRecord', JSON.stringify(canRecord));
  const hasRecordPermission = await VoiceRecorder.hasAudioRecordingPermission()
  console.debug('hasRecordPermission', JSON.stringify(hasRecordPermission));
  /**
    * will prompt the user to give the required permission, after that
    * the function will print true / false based on the user response
    */
  let hasAnswerPermission = null;
  if (!!canRecord?.value && !hasRecordPermission?.value) {
    hasAnswerPermission = await VoiceRecorder.requestAudioRecordingPermission()
    console.debug('hasAnswerPermission', JSON.stringify(hasAnswerPermission));
  }
  
  return {
    canRecord: canRecord?.value,
    hasRecordPermission: hasRecordPermission?.value,
    hasAnswerPermission
  };
}

export const askCameraPermissions = () => {
  Camera.checkPermissions()
    .then(result => {
      if (result?.camera !== 'granted' || result?.photos !== 'granted') {
        Camera.requestPermissions().then(result => {
          console.debug('info Camera.requestPermissions: ' + JSON.stringify(result));
        });
      }
    })
    .catch(error => console.log('info Camera Error: ' + JSON.stringify(error)));
};

export const usePhotoGallery = () => {
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

export const takePicture = async () => {
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

export const downloadAndInstallApk = async (apkUrl, appId) => {
  if (!!apkUrl && !!appId) {
    try {
      // Open the APK file in the device's browser
      await Browser.open({ url: apkUrl });
  
      // Check if the app was installed successfully
      const isInstalled = await App.isInstalled({ id: appId });
      if (isInstalled) {
        alert('Update installed successfully. Restarting the app...');
        const deviceInfo = await Device.getInfo();
        if (deviceInfo.platform === 'ios') {
          // On iOS, you'll need to manually restart the app after the update is installed
          // Your implementation for restarting the app goes here
          alert(`On iOS, you'll need to manually restart the app after the update is installed`);
        } else {
          // On Android, the app will automatically restart after the update is installed
          App.exitApp();
        }
      } else {
        alert('Failed to install update');
      }
    } catch (error) {
      console.error(error);
    //  alert('Failed to install update');
    }
  } else {
    console.error(`Error in downloadAndInstallApk: apkUrl or appId is Empty!!`)
    console.debug(`Error in downloadAndInstallApk: apkUrl or appId is Empty!!`)
  }

}

export {
  // core
  Capacitor,
  PushNotifications,
  Camera
};