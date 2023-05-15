/**
 * CometChat
 */

import { CometChat } from '@cometchat-pro/chat';
import { isWeb } from './capacitorHelper';
import {
  DEVELOPMENT_COMET_AUTH,
  DEVELOPMENT_COMET_ID,
  PRODUCTION_COMET_AUTH,
  PRODUCTION_COMET_ID,
} from './constants';

// chat stuff
let appID = DEVELOPMENT_COMET_ID;
let authKey = DEVELOPMENT_COMET_AUTH;
const region = 'eu';

if (isWeb && process.env.BASE_ENV === 'production') {
  if (window.location.origin.includes('app.beemed.com')) {
    appID = PRODUCTION_COMET_ID;
    authKey = PRODUCTION_COMET_AUTH;
  } else {
    appID = DEVELOPMENT_COMET_ID;
    authKey = DEVELOPMENT_COMET_AUTH;
  }
} else if (isWeb && process.env.BASE_ENV === 'staging') {
  appID = DEVELOPMENT_COMET_ID;
  authKey = DEVELOPMENT_COMET_AUTH;
} else if (isWeb && process.env.BASE_ENV === 'development') {
  appID = DEVELOPMENT_COMET_ID;
  authKey = DEVELOPMENT_COMET_AUTH;
}

if (!isWeb && process.env.BASE_ENV === 'production') {
  appID = PRODUCTION_COMET_ID;
  authKey = PRODUCTION_COMET_AUTH;
} else if (!isWeb && process.env.BASE_ENV === 'staging') {
  appID = DEVELOPMENT_COMET_ID;
  authKey = DEVELOPMENT_COMET_AUTH;
} else if (!isWeb && process.env.BASE_ENV === 'development') {
  appID = DEVELOPMENT_COMET_ID;
  authKey = DEVELOPMENT_COMET_AUTH;
}

const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();

const initCometChat = async id => {
  // First initialize the app
  await CometChat.init(appID, appSetting);
  // Login the user
  return await CometChat.login(id, authKey);
};

const loginUserCometChat = userToLogged => {
  CometChat.login(userToLogged._id, authKey).then(
    user => {
      //console.debug('Login Successful:', { user });
      return true;
    },
    error => {
      console.debug('Login failed with exception:', { error });
      return false;
    },
  );
};

const updateUserCometChat = (id, firstname, lastname, image) => {
  const uid = id;
  let name = firstname && lastname && firstname + ' ' + lastname;
  let avatar = image;
  let link = `/profile/${uid}`;
  let updateUser = new CometChat.User(uid);
  name && updateUser.setName(name);
  avatar && updateUser.setAvatar(avatar.replace(' ', '%20'));

  return CometChat.updateUser(updateUser, authKey).then(
    user => {
      //console.log('user updated', user);
      return user;
    },
    error => {
      console.log('error', error);
    },
  );
};

const createUserCometChat = user => {
  CometChat.createUser(user, authKey).then(
    user => {
      //console.log('user created', user);
      return true;
    },
    error => {
      console.log('error', error);
      return false;
    },
  );
};

const registerTokenCometChat = user => {
  if (user?.registrationTokens.length > 0 && !isWeb) {
    //console.debug('REGISTRATION TOKEN MOBILE');
    for (let i = 0; i < user.registrationTokens.length; i++) {
      let testToken = user.registrationTokens[i].token;
      CometChat.registerTokenForPushNotification(testToken).then(result => {
        //console.debug(result);
      });
    }
    return true;
  }
};

const getChatAmountUnreadMessage = async () => {
  return await CometChat.getUnreadMessageCount().then(
    array => {
      const groupMessages = array?.groups
        ? Object.keys(array?.groups).length
        : 0;
      const usersMessages = array?.users ? Object.keys(array?.users).length : 0;

      return usersMessages + groupMessages;
    },
    error => {
      console.log('Error in getting message count', error);
    },
  );
};

export {
  initCometChat,
  loginUserCometChat,
  registerTokenCometChat,
  updateUserCometChat,
  createUserCometChat,
  getChatAmountUnreadMessage,
};
