export { default as appBage } from './helper.badge';
export { default as appStatusBar } from './helper.statusBar';
export { default as appHaptics } from './helper.haptics';
export { default as appUpdate } from './helper.update.js';
export { default as appPushNotifications } from './pushNotifications';

import {
  // core
  Capacitor,
  PushNotifications,
  Camera,
  // custom
  deviceInfo,
  appInfo,
  isWeb,
  isAndroid,
  isIos,
  getBaseApiUrl,
  getBaseDomainOrigin,
  askCameraPermissions,
  askRecordAudioPermission,
  usePhotoGallery,
  // check
  downloadAndInstallApk,
} from './helper.capacitor';

// helper.capacitor
export {
  // core
  Capacitor,
  PushNotifications,
  Camera,
  // custom
  deviceInfo,
  appInfo,
  isWeb,
  isAndroid,
  isIos,
  getBaseApiUrl,
  getBaseDomainOrigin,
  askCameraPermissions,
  askRecordAudioPermission,
  usePhotoGallery,
  // check
  downloadAndInstallApk,
}