import axios from 'axios';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';

import {
  isWeb,
  appInfo,
  getBaseApiUrl,
} from './helper.capacitor';

axios.defaults.baseURL = getBaseApiUrl();

const appIsReady = async () => {
  return await CapacitorUpdater.notifyAppReady();
}

const getAppVersion = async () => {
  const appIn = await appInfo() || {};
  const { id, build, version } = appIn;

  const current = await CapacitorUpdater.current();
  const { version: bundleVersion2 } = current.bundle;
  const bundlVersion = bundleVersion2 != 'builtin' ?  bundleVersion2 : version;
  const bundlBuild = bundleVersion2 != 'builtin' ?  Number(bundlVersion.replaceAll('.', '')) : build;

  const result = await axios.post(`auth/control/${version}`, { isApp: true }).then(res => res.data);

  let resultVersion = version;
  let resultBuild = build;
  let newVerstion = version;
  let newBuild = build;

  if (bundlBuild < result?.currentBuild) {
    resultBuild = bundlBuild;
    resultVersion = bundlVersion;
    newVerstion = result?.currentVersion;
    newBuild = result?.currentBuild;
  } else if ( bundlBuild >= result?.currentBuild ) {
    if (build == bundlBuild) {
      resultBuild = build;
      resultVersion = version;
      newVerstion = result?.currentVersion;
      newBuild = result?.currentBuild;
    } else if ( build < bundlBuild  ) {
      resultBuild = bundlBuild;
      resultVersion = bundlVersion;
      newVerstion = result?.currentVersion;
      newBuild = result?.currentBuild;
    }
  }

  /* console.debug(`run bundle current!`, JSON.stringify(appIn));
  console.debug(`run bundle current!`, JSON.stringify(current));
  console.debug(`run bundle current!`, JSON.stringify(result)); */
  const final = {
    version: resultVersion,
    build: resultBuild,
    newBuild: newBuild,
    newVersion: newVerstion
  };
 /*  console.debug(`run bundle final!`, JSON.stringify(final)); */
  return final;
}

const checkAndUpdateApp = async () => { 

  const appIn = await appInfo() || {};
  const { id, build, version } = appIn;


  if (!!version) {
    const currentBundl = await getAppVersion();
    const result = await axios.post(`auth/control/${version}`, { isApp: true }).then(res => res.data);
    if (currentBundl?.build < result?.currentBuild) {
      await checkAndUpdate({
        url: result?.url,
        version: result?.currentVersion
      });
    } else {
      Toast.show({
        text: `The current version is up to date`,
        duration: 'short',
      });
    }
    return {...result, ...appIn};
  } else {
    Toast.show({
      text: `The current version is up to date`,
      duration: 'short',
    });
    return appIn;
  }
  
};

const checkAndUpdate = async (props) => {
  const { url, version } = props;
 // console.debug('run checkAndUpdate:', JSON.stringify(props));
  const canAutoUpdate = await CapacitorUpdater.isAutoUpdateEnabled().then(r => r?.enabled);
  //console.debug('run canAutoUpdate:', JSON.stringify( canAutoUpdate));
  if (!!canAutoUpdate) {
    if (!!url) {
       // Show an alert to the user asking if they want to update
      const { value } = await Dialog.confirm({
        title: 'Confirm',
        message: `A new update is available, do you want to download it now?`,
      });
      
      if (!!value) {
        // Start the download
        CapacitorUpdater.download({
          url,
          version
        }).then((BundleInfo) => {
          CapacitorUpdater.set(BundleInfo); 
        });
      }
    } else {
      Toast.show({
        text: `File download error, please try again later.`,
        duration: 'short',
      });
    }
  } else {
    console.debug('run checkAndUpdate Error: isAutoUpdateEnabled is disabled');
  }
}

/* 
BundleInfo:
  id:	string
  version:	string
  downloaded:	string
  checksum:	string
  status:	"success" | "error" | "pending" | "downloading"
*/

const appDownloadComplete = (bundle) => {
  // console.debug(`appDownloadComplete!`, JSON.stringify(bundle));
  Toast.show({
    text: "Update downloaded, the app will now reload",
    duration: 'short',
  });
  // Reload the app to apply the update
  CapacitorUpdater.reload();
};

const appDownloading = (info, setProgressPercent) => {
  const { percent, bundle } = info;
  /* console.debug(`Download progress: ${percent}`, percent > 0 && percent != 100); */
  // Show the download progress as a toast
  setProgressPercent(percent);
  if ( percent == 0 ) {
    // Show the updated download progress as a toast
    Toast.show({
      text: `Downloading is started... Please wait a moment!`,
      duration: 'short',
    });
  }
  
};

const appDownloadFailed = async (version) => {
  //console.debug(`appDownloadFailed!`, JSON.stringify(version));
  Toast.show({
    text: `File download error, please try again later.`,
    duration: 'short',
  });
};
const appNoNeedUpdate = async (bundle) => {
  const currentBundl = await getAppVersion();
  // console.debug(`apppNoNeedUdate!`, JSON.stringify(bundle));
//console.debug(`appNoNeedUpdate! currentBundl`, JSON.stringify(currentBundl));
  if (currentBundl?.build < result?.newBuild) { 
    checkAndUpdateApp();
  }
};

const appUpdateAvailable = async (bundle) => {
  //const { version, status, downloaded, id, checksum } = bundle;
 // const currentBundl = await getAppVersion();
  // console.debug(`appUpdateAvailable!`, JSON.stringify(bundle));
  // console.debug(`appUpdateAvailable! currentBundl`, JSON.stringify(currentBundl));
};
const appReloadedCallback = async (bundle) => {
  //console.debug(`appReloadedCallback!`, JSON.stringify(bundle));
  // Delete the downloaded zip archive
  CapacitorUpdater.delete();
};

export default {
  getAppVersion,
  checkAndUpdateApp,
  appIsReady,
  checkAndUpdate,
  appDownloadComplete,
  appDownloading,
  appDownloadFailed,
  appNoNeedUpdate,
  appUpdateAvailable,
  appReloadedCallback
}