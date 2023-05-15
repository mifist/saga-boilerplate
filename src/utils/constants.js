export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

const BASE_API = '192.168.0.243'; // 192.168.31.226 || 172.31.176.1
const BASE_NAME = 'beemed';

export const DEVELOPMENT_API_URL = 'http://localhost:8080/api/';
export const DEVELOPMENT_APP_API_URL = `http://${BASE_API}:8080/api/`;

export const STAGING_API_URL = `https://${BASE_NAME}-test.herokuapp.com/api/`;
export const PRODUCTION_API_URL = `https://${BASE_NAME}-production.herokuapp.com/api/`;

export const PRODUCTION_VIDEOS_API_URL = `https://${BASE_NAME}-video.herokuapp.com/api/`;

export const BEEMED_LEGACY_API_URL = `https://${BASE_NAME}.com/api/`;
export const PROXY_API_URL = 'https://tcf-reverse-proxy.herokuapp.com/';

export const DEVELOPMENT_HOSTING_URL = 'http://localhost:3000/';
export const STAGING_HOSTING_URL = `https://beta.${BASE_NAME}.com/`;
export const PRODUCTION_HOSTING_URL = `https://app.${BASE_NAME}.com/`;

export const APPLE_STORE_URL = `https://apps.apple.com/fr/app/${BASE_NAME}/id1588569081`;
export const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=com.${BASE_NAME}.app`;

export const DEVELOPMENT_INDEX_SEARCH = 'dev_beemed';
export const PRODUCTION_INDEX_SEARCH = 'prod_beemed';
export const STAGING_INDEX_SEARCHL = 'dev_beemed';

// cometchat
export const DEVELOPMENT_COMET_ID = '2074457c72425318';
export const DEVELOPMENT_COMET_AUTH =
  '508c441eff1007834222fe8398a27a21d3785521';
export const PRODUCTION_COMET_ID = '202319dc8d3c1624';
export const PRODUCTION_COMET_AUTH = 'ebf5d5d7130e7bd1bb8be0d5db53b09996ff102c';

// Temp for Chat 512
// https://github.com/tracker1/cryptico-js
export const RSAkeyPair = {
  MattsPublicKey:
    'lO7ZZ7Rz959hTfkltfTm9iaeQ/vJr8AJ6GFFGcgzG1awkk+6oP2do1ucj07pVP+VszxpvpNssXDo/goICgubKw==',
  MattsPublicID: '43837f26fe0b34db872ee6304256ef5d',
  RSAKey: {
    coeff: 'ca9c2bd7d68e1d4802ba883138334d739a0cc52e3f0fab48deb354baf9141342',
    d:
      '6349e64522f7fa6a40dea61923f899f96f142d5286752ab145962e1130221238c66cdf10253f4d0e5c2b445dd58d6371b64e27a8edf203a46edb91bd2440d2eb',
    dmp1: '884a2f967c8ef1c41266da3f72699c3ac6f2274b68fc0ea219b0224ffdc96b4b',
    dmq1: '7c55268074302a4523d640eca8ec5561fa3d4ce00b5a6404bd72fd4d8f52d3e7',
    e: '3',
    n:
      '94eed967b473f79f614df925b5f4e6f6269e43fbc9afc009e8614519c8331b56b0924fbaa0fd9da35b9c8f4ee954ff95b33c69be936cb170e8fe0a080a0b9b2b',
    p: 'cc6f4761bad66aa61b9a475f2b9e6a582a6b3af11d7a15f326883377fcae20f1',
    q: 'ba7fb9c0ae483f67b5c16162fd628012f75bf350110796071c2c7bf456fc3ddb',
  },
};

// set to local for testing
RSAkeyPair &&
  localStorage.setItem(
    'BeeMedChatKeyPairRecipient',
    JSON.stringify(RSAkeyPair),
  );
