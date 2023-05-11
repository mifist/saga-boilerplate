export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const APP_VERSION = process.env.APP_VERSION;

const BASE_API = process.env.LOCAL_BACKEND || process.env.LOCAL_HOST || 'localhost'; // 192.168.31.226 || 172.31.176.1
const BASE_NAME = process.env.BASE_NAME || '';

export const DEVELOPMENT_LOCAL_API_URL = 'http://localhost:8080/api/';
export const DEVELOPMENT_LOCAL_APP_API_URL = `http://${BASE_API.toString()}:8080/api/`;

export const DEVELOPMENT_API_URL = `https://${BASE_NAME}-dev.herokuapp.com/api/`;
export const STAGING_API_URL = `https://${BASE_NAME}.herokuapp.com/api/`;
export const PRODUCTION_API_URL = `https://${BASE_NAME}-app.herokuapp.com/api/`;

export const LEGACY_API_URL = `https://${BASE_NAME}.com/api/`;
export const PROXY_API_URL = 'https://tcf-reverse-proxy.herokuapp.com/';

export const DEVELOPMENT_HOSTING_URL = 'http://localhost:3000/';
export const STAGING_HOSTING_URL = `https://beta.${BASE_NAME}.com/`;
export const PRODUCTION_HOSTING_URL = `https://app.${BASE_NAME}.com/`;

export const APPLE_STORE_URL = `https://apps.apple.com/fr/app/${BASE_NAME}/id1588569081`;
export const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=com.${BASE_NAME}.app`;

export const STORAGE_BUCKET_URL = `https://storage.googleapis.com/${BASE_NAME}-dev`;
