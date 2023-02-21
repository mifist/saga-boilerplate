const path = require('path');
const ROOT_PATH = path.resolve(process.cwd());

const envKeys = require(path.resolve(process.cwd(), 'config', 'environment', 'index.js'));

const { ROOT_APP_FOLDER, BASE_ENV, BASE_NAME, APP_NAME, MOBILE_LOCAL_BACKEND, BASE_API, CAPACITOR_ENV } = envKeys;

let initJSON = {
  appId: `com.${BASE_NAME}.app`,
  appName: `${APP_NAME}`,
  webDir: 'build',
  npmClient: 'npm',
  bundledWebRuntime: false,
  plugins: {
    CapacitorUpdater: {
			autoUpdate: true
		},
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#005D9F',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    Badge: {
      persist: true,
      autoClear: false,
    },
    ios: {
      contentInset: "always",
      scheme: "AppName",
      limitsNavigationsToAppBoundDomains: true
    }
  },
};

if (CAPACITOR_ENV == 'local' || BASE_ENV == 'local' || CAPACITOR_ENV == 'local-dev') {
  const baseUrl = `http://${BASE_API}:3000`;
  if (!initJSON?.server || initJSON?.server?.url != baseUrl) {
    initJSON['server'] = {
      url: baseUrl,
      cleartext: true,
    };
    if (MOBILE_LOCAL_BACKEND) {
      initJSON['server']['allowNavigation'] = [
        `${MOBILE_LOCAL_BACKEND}`,
      ];
    }
  }
  // --
  initJSON['webDir'] = ROOT_APP_FOLDER || 'app';
} else {
  initJSON['webDir'] = 'build';
  delete initJSON['server'];
}

module.exports = initJSON;