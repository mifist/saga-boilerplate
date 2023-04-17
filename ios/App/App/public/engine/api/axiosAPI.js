import axios from 'axios';
// utils
import { getBaseApiUrl } from 'appCapacitor/helpers';

axios.defaults.baseURL = getBaseApiUrl();

export const endpoint = {
  users: {
    single:  (userID) => !!userID && (`users/${userID}`),
    childrenList: (parentID) => !!parentID && (
      `users/${parentID}/children`
    ),
  },
}

const api = {
  auth: {
    checkAppVersion: (appVersion, isAppData) =>
      !!appVersion && axios.post(`auth/control/${appVersion}`, { isApp: isAppData }).then(res => res.data),
    forgotPassword: data =>
      !!data && axios.post(`auth/forgot`, data).then(res => res.data),
    resetPassword: data =>
      !!data && axios.post(`auth/reset`, data).then(res => res.data),
    confirmProfile: data =>
      !!data && axios.post(`auth/confirm`, data).then(res => res.data),
    resendConfirmProfile: data =>
      !!data && axios.post(`auth/confirm/resend`, data).then(res => res.data),
    signUp: newUser =>
      !!newUser && axios.post(`auth/signup`, newUser).then(res => res.data),
  },
  route: {
    fetchAll: (endpoint, endponitSend) =>
      axios
        .get(endpoint, {
          params: endponitSend,
        })
        .then(res => res.data.data),
    findAll: (endpoint, endponitSend) =>
      axios
        .post(endpoint, {
          params: endponitSend,
        })
        .then(res => res.data),
    fetchById: (endpoint, id) =>
      !!id && axios.get(`${endpoint}/${id}`).then(res => res.data),
    update: (endpoint, objectData) =>
      axios.patch(`${endpoint}/`, objectData).then(res => res.data),
    updateMedia: body =>
      axios.patch(`media/upload/`, body).then(res => res.data),
    remove: (endpoint, objectData) =>
      axios.patch(`${endpoint}/remove`, objectData).then(res => res.data),
  },

  users: {
    getByID: id => !!id && axios.get(endpoint.users.single(id)).then(res => res.data),
  },
};

export function setAuthorizationHeader(token) {
  const currentUser = JSON.parse(localStorage.getItem('sagaboilerplate_user'));
  if (!!token || currentUser?.token) {
    const initToken = !!token ? token : currentUser?.token;
    axios.defaults.headers.common.Authorization = `Token ${initToken}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export default api;
