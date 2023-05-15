import * as React from 'react';

import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import moment from 'moment';

import { getBaseApiUrl } from 'utils/capacitorHelper';
// import generateKeyPair from 'engine/CometChatWorkspace/src/util/lib/generateKeyPair';

let apiURL = getBaseApiUrl();

import {
  initCometChat,
  updateUserCometChat,
  getChatAmountUnreadMessage,
} from 'utils/cometChatHelper';
import { registerPush } from 'utils/fcmHelper';
import { withTranslation } from 'react-i18next';
axios.defaults.baseURL = apiURL;
const defaultContext = {};

export const UserContext = React.createContext(defaultContext);

export const askCameraPermissions = () => {
  Camera.checkPermissions()
    .then(result => {
      if (result?.camera !== 'granted' || result?.photos !== 'granted') {
        Camera.requestPermissions().then(result => {
          // console.debug('info Camera.requestPermissions: ' + JSON.stringify(result));
        });
      }
    })
    .catch(error => console.log('info Camera Error: ' + JSON.stringify(error)));
};


const initialState = {
  events: [],
  followers: [],
  bookmarks: [],
  communities: [],
  bookmarksEvents: [],
  acl: [],
  active: true,
  username: '',
  email: '',
  language: 'en',
  description: {
    firstname: '',
    lastname: '',
    description: '',
    company: '',
    website: '',
  },
  address: {
    telephone: '',
    country: '',
    city: '',
    address: '',
  },
  score: { badges: [], score: 0 },
  credential: {
    isDoctor: true,
    studies: [],
    title: '',
    anatomies: [],
    domains: [],
    qualifications: [],
  },
  lastAction: '',
  creationDate: '',
  image: '',
  isReady: false,
  _id: null,
  role: '',
  registrationTokens: [],
  notificationsSetting: {
    pushNotification: true,
    emailNotification: true,
  },
  deviceInfo: '',
  chatUnreadMessageCount: 0,
  loading: false,
  chatInit: false,
  chatReady: false,
};

class UserProvider extends React.Component {
  async componentDidMount() {
    const local = localStorage.getItem('beemed_user');
    if (local !== null) {
      const currentUser = JSON.parse(local);
      await this.setAuthorizationHeader(currentUser?.token);
      await this.generateChatKeyPair(currentUser._id);
    }
    await this.authLocalUser();
  }

  setAuthorizationHeader = async (token = null) => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  changeChatState = value => {
    this.setState({
      chatReady: value,
      chatInit: value,
    });
  };

  authLocalUser = async () => {
    const local = localStorage.getItem('beemed_user');
    const info = await Device.getId();

    if (local !== null) {
      const currentUser = JSON.parse(local);
      const response = await axios.get(`users/bookmarks/${currentUser._id}`);
      if (response.status === 200) {
        moment.locale(response.data.language);
        this.props.i18n.changeLanguage(response.data.language);
        localStorage.setItem('cometchat:locale', response.data.language);

        this.setState({
          ...response.data,
          isReady: true,
        });
        this.setState({
          deviceInfo: info,
        });
      }
    }
  };

/*   generateChatKeyPair = async userID => {
    const localKeyPair = await localStorage.getItem('BeeMedChatKeyPair');
    if (!localKeyPair && userID) {
      let newKeyPair = await generateKeyPair(userID);
      //console.log('generateChatKeyPair', { userID, newKeyPair });
      newKeyPair &&
        localStorage.setItem('BeeMedChatKeyPair', JSON.stringify(newKeyPair));
      return newKeyPair;
    } else {
      const localKeyPairObj = JSON.parse(localKeyPair);
      return localKeyPairObj;
    }
  }; */

  patchUser = async () => {
    console.debug('patchUser');
    this.setState({
      loading: true,
    });

    const local = localStorage.getItem('beemed_user');
    if (local !== null) {
      const currentUser = JSON.parse(local);
      await this.setAuthorizationHeader(currentUser?.token);
    }
    axios.defaults.baseURL = apiURL;

    const response = await axios.patch(`users`, {
      ...this.state,
    });
    // console.log(this.state.image);
    updateUserCometChat(
      this.state._id,
      this.state.description.firstname,
      this.state.description.lastname,
      this.state.image.replace(/ /g, '%20'),
    ).then(resultUser => {
      //console.log({ resultUser });
      resultUser && this.setChatUnreadMessageAmount();
    });
    this.setState({
      loading: false,
    });
  };

  getChatUnreadMessageAmount = () => {
    return this.state.chatUnreadMessageCount;
  };

  setChatUnreadMessageAmount = async () => {
    return await getChatAmountUnreadMessage()
      .then(unreadMessageCount => {
        this.setState({
          chatUnreadMessageCount: unreadMessageCount || 0,
        });
        return unreadMessageCount;
      })
      .catch(error => {
        this.setState({
          chatUnreadMessageCount: 0,
        });
      });
  };

  handleFinishTour = async currentUser => {
    // console.debug(apiURL);
    const response = await axios.patch(`users`, {
      isTourFinished: true,
      _id: currentUser,
    });
    this.setState({
      isTourFinished: true,
    });
  };

  uploadAvatar = body => {
    const response = axios.post(`posts/upload/`, body);

    response
      .then(response => {
        if (response.status === 200) {
          this.setState({ image: response.data.url });
        }
      })
      .catch(error => {
        if (error?.response?.data.hasOwnProperty('url')) {
          this.setState({ image: error?.response?.data.url });
        }
      });
  };

  populateUser = async userData => {
    this.setState({
      ...userData,
    });

    if (Capacitor.platform !== 'web') {
      await initCometChat(userData._id).then(async res => {
        res && (await this.setChatUnreadMessageAmount());
      });
      await registerPush(userData._id);
      askCameraPermissions();
    }
  };

  onChangeState = (name, value, parent) => {
    if (parent === null) {
      this.setState({ [name]: value });
    } else {
      const parentValue = { ...this.state[parent] };
      parentValue[name] = value;
      this.setState({ [parent]: parentValue });
    }
  };

  onRemoveBookMark = (_id, typeBookMark) => {
    const { loading } = this.state;

    if (!loading) {
      let name = 'bookmarks';

      if (typeBookMark === 'event') {
        name = 'bookmarksEvents';
      }

      const { [name]: books } = this.state;

      const removed = books.filter(item => {
        if (typeof item === 'string') {
          return item !== _id;
        } else if (typeof item === 'object') {
          return item._id !== _id;
        } else {
          return false;
        }
      });

      this.setState(
        {
          [name]: removed,
        },
        () => {
          // Callback
          this.patchUser();
        },
      );
    }
  };

  // push into array
  onPushBookMark = (_id, typeBookMark) => {
    const { loading } = this.state;

    if (!loading) {
      let name = 'bookmarks';

      if (typeBookMark === 'event') {
        name = 'bookmarksEvents';
      }

      const { [name]: books } = this.state;
      books.push(_id);

      this.setState(
        {
          [name]: books,
        },
        () => {
          // Callback
          this.patchUser();
        },
      );
    }
  };

  // push into array
  onPushFollowers = _id => {
    const { loading } = this.state;

    if (!loading) {
      const { followers } = this.state;
      followers.push(_id);
      this.setState({ followers }, () => this.patchUser());
    }
  };

  onRemoveFollowers = _id => {
    const { loading } = this.state;

    if (!loading) {
      const { followers } = this.state;
      const removed = followers.filter(item => item !== _id);
      this.setState({ followers: removed }, () => this.patchUser());
    }
  };

  logoutUser = () => {
    this.setState(initialState);
  };

  state = {
    ...initialState,
    // isTourFinished: false,
    authLocalUser: this.authLocalUser,
    setAuthorizationHeader: this.setAuthorizationHeader,
    populateUser: this.populateUser,
    onChangeState: this.onChangeState,
    patchUser: this.patchUser,
    handleFinishTour: this.handleFinishTour,
    uploadAvatar: this.uploadAvatar,
    onPushBookMark: this.onPushBookMark,
    onRemoveBookMark: this.onRemoveBookMark,
    onPushFollowers: this.onPushFollowers,
    onRemoveFollowers: this.onRemoveFollowers,
    setChatUnreadMessageAmount: this.setChatUnreadMessageAmount,
    getChatUnreadMessageAmount: this.getChatUnreadMessageAmount,
    registerPush: this.registerPush,
    logoutUser: this.logoutUser,
    changeChatState: this.changeChatState,
  };

  render() {
    const { children } = this.props;

    return (
      <UserContext.Provider value={this.state}>{children}</UserContext.Provider>
    );
  }
}

export default withTranslation()(UserProvider);

export const withUser = Component => props => (
  <UserContext.Consumer>
    {store => <Component user={store} {...props} />}
  </UserContext.Consumer>
);
