const path = require('path');
const fsPromises = require('fs').promises;

const ROOT_PATH = path.resolve(process.cwd());

const envKeys = require(path.resolve(process.cwd(), 'config', 'environment', 'index.js'));

const CAPACITOR_INIT_JSON = require(`./capacitor.config.init.js`);
const CAPACITOR_CONFIG_FILE_PATH = path.resolve(`${ROOT_PATH}/capacitor.config.json`);

const { ROOT_APP_FOLDER, BASE_ENV, BASE_NAME, APP_NAME, MOBILE_LOCAL_BACKEND, BASE_API, CAPACITOR_ENV } = envKeys;

/* if (BASE_ENV == 'local') {
  console.log('CAPACITOR BUILD', { envKeys });
} */

let initJSON = CAPACITOR_INIT_JSON;

fsPromises
  .readFile(CAPACITOR_CONFIG_FILE_PATH, 'utf8')
  .then(data => {
    let json = JSON.parse(data);
  
    //// Here - update your json as per your requirement ////

    const appId = `com.${BASE_NAME}.app`;
    const appName = `${APP_NAME}`;

    if (BASE_NAME && json['appId'] != appId) {
      json['appId'] = `com.${BASE_NAME}.app`;
    }

    if (APP_NAME && appName != json['appName']) {
      json['appName'] = `${APP_NAME}`;
    }

    if (CAPACITOR_ENV == 'local' || BASE_ENV == 'local' || CAPACITOR_ENV == 'local-dev') {
      const baseUrl = `http://${BASE_API}:3000`;
      if (!json?.server || json?.server?.url != baseUrl) {
        json['server'] = {
          url: baseUrl,
          cleartext: true,
        };
        if (MOBILE_LOCAL_BACKEND) {
          json['server']['allowNavigation'] = [
            `${MOBILE_LOCAL_BACKEND}`,
          ];
        }
      }
      // --
      json['webDir'] = ROOT_APP_FOLDER || 'app';
    } else {
      json['webDir'] = 'build';
      delete json['server'];
    }

    //// Here - update your json as per your requirement - END ////
    
    fsPromises
      .writeFile(CAPACITOR_CONFIG_FILE_PATH, JSON.stringify(json))
      .then(() => {
        console.log('CAPACITOR BUILD: Success');
      })
      .catch(err => {
        if (err.code == 'ENOENT' && err.syscall == 'open' && Object.keys(initJSON).length > 0) {
          fsPromises
            .writeFile(`${ROOT_PATH}/capacitor.config.json`, JSON.stringify(initJSON))
            .then(() => {
              console.log('CAPACITOR BUILD: Success');
            })
            .catch(err => {
              console.log('CAPACITOR BUILD: Failed: ' + err);
            });
        } else {
          console.log('CAPACITOR BUILD: Failed: ' + err);
        }
      });
    
  })
  .catch(err => {
    if (err.code == 'ENOENT' && err.syscall == 'open' && Object.keys(initJSON).length > 0) {
      fsPromises
        .writeFile(`${ROOT_PATH}/capacitor.config.json`, JSON.stringify(initJSON))
        .then(() => {
          console.log('CAPACITOR BUILD: Success');
        })
        .catch(err => {
          console.log('CAPACITOR BUILD: Failed: ' + err);
        });
    } else {
      console.log('CAPACITOR BUILD: Failed: ' + err);
    }
  });
