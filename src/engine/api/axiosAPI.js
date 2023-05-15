import axios from 'axios';
import i18n from 'i18next';
import { getBaseApiUrl } from 'utils/capacitorHelper';

const apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;
// axios.defaults.headers['accept-language'] = i18n.language;

const communityRequests = {
  /**
   * For createRequestToJoin
    body : {
      community : String, // request ID, required
      user: String, // user ID from request, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  createRequestToJoin: body =>
    axios
      .post(`communities/request/new`, {
        ...body,
        role: body?.role || 'member',
      })
      .then(res => res.data),
  /**
   * For updateRoleRequestToJoin
    body : {
      _id : String, // request ID, required
      user: String, // user ID from request, required
      community: String, // community ID from request, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  updateRoleRequestToJoin: body =>
    axios
      .patch(`communities/request`, {
        ...body,
        processed: false,
        rejected: false,
      })
      .then(res => res.data),
  /**
   * For acceptRequestToJoin
    body : {
      _id : String, // request ID, required
      user: String, // user ID from request, required
      community: String, // community ID from request, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  acceptRequestToJoin: body =>
    axios
      .patch(`communities/request`, {
        ...body,
        processed: true,
        rejected: false,
      })
      .then(res => res.data),
  /**
   * For rejectedRequestToJoin:
    body : {
      _id : String, // request ID, required
      user: String, // user ID from request, required
      community: String, // community ID from request, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  rejectedRequestToJoin: body =>
    axios
      .patch(`communities/request`, {
        ...body,
        processed: true,
        rejected: true,
      })
      .then(res => res.data),
};

const communityInvitation = {
  /**
   * For createInvitationToJoin
    body : {
      community : String, // invitation ID, required
      user: String, // user ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  createInvitationToJoin: body =>
    axios
      .post(`communities/invitation/new`, {
        ...body,
        role: body?.role || 'member',
      })
      .then(res => res.data),
  /**
   * For updateRoleInvitationToJoin
    body : {
      _id : String, // invitation ID, required
      user: String, // user ID from invitation, required
      community: String, // community ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  updateRoleInvitationToJoin: body =>
    axios
      .patch(`communities/invitation`, {
        ...body,
        processed: false,
        rejected: false,
      })
      .then(res => res.data),
  /**
   * For acceptInvitationToJoin
    body : {
      _id : String, // invitation ID, required
      user: String, // user ID from invitation, required
      community: String, // community ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  acceptInvitationToJoin: body =>
    axios
      .patch(`communities/invitation`, {
        ...body,
        processed: true,
        rejected: false,
      })
      .then(res => res.data),
  /**
   * For rejectedInvitationToJoin:
    body : {
      _id : String, // invitation ID, required
      user: String, // user ID from invitation, required
      community: String, // community ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  rejectedInvitationToJoin: body =>
    axios
      .patch(`communities/invitation`, {
        ...body,
        processed: true,
        rejected: true,
      })
      .then(res => res.data),
};

const userCommunityInvitation = {
  fetchAllUserInvitations: userId =>
    axios.get(`users/invitations/${userId}`).then(res => res.data),

  updateCommunityInvitationForUser: invitationBody =>
    axios.patch(`users/invitations/`, invitationBody).then(res => res.data),

  /**
   * For updateRoleInvitationToJoin
    body : {
      _id : String, // invitation ID, required
      user: String, // user ID from invitation, required
      community: String, // community ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  updateRoleInvitationToJoin: body =>
    axios
      .patch(`users/invitations`, {
        ...body,
        processed: false,
        rejected: false,
      })
      .then(res => res.data),
  /**
   * For acceptInvitationToJoin
    body : {
      _id : String, // invitation ID, required
      user: String, // user ID from invitation, required
      community: String, // community ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  acceptInvitationToJoin: body =>
    axios
      .patch(`users/invitations`, {
        ...body,
        processed: true,
        rejected: false,
      })
      .then(res => res.data),
  /**
   * For rejectedInvitationToJoin:
    body : {
      _id : String, // invitation ID, required
      user: String, // user ID from invitation, required
      community: String, // community ID from invitation, required
      role: "member", // 'admin', 'moderator', 'member'
    }
  */
  rejectedInvitationToJoin: body =>
    axios
      .patch(`users/invitations`, {
        ...body,
        processed: true,
        rejected: true,
      })
      .then(res => res.data),
};

const api = {
  route: {
    fetchAll: (endpoint, endponitSend) =>
      axios
        .get(endpoint, {
          params: endponitSend,
        })
        .then(res => res.data.data),
    fetchById: (endpoint, id) =>
      axios.get(`${endpoint}/${id}`).then(res => res.data),
    update: (endpoint, objectData) =>
      axios.patch(`${endpoint}/`, objectData).then(res => res.data),
    updateMedia: body =>
      axios.patch(`media/upload/`, body).then(res => res.data),
    remove: (endpoint, objectData) =>
      axios.patch(`${endpoint}/remove`, objectData).then(res => res.data),
  },
  users: {
    fetchAllMentions: endponitSend =>
      axios
        .post(`users/mentions`, { params: endponitSend })
        .then(res => res.data),

    // Invitations
    invitation: userCommunityInvitation,
    hideOrShowComment: data =>
      axios.post('/users/hide-show-comment', data).then(res => res.data),
    reportUser: data => axios.post('/users/report', data),
    fetchAllCountries: () =>
      axios.get('/dictionary/countries').then(res => res.data),
    getEventLinkById: ({ eventId, userId }) =>
      axios.get(`/users/events/${eventId}/${userId}`),
    getEcoursesLinkById: ({ ecourseId, userId }) =>
      axios.get(`/users/ecourse/${ecourseId}/${userId}`),
    getEcoursesLink: ({ userId }) => axios.get(`/users/ecourse/${userId}`),
  },
  notifications: {
    fetchAll: (userId, limit, page) =>
      axios
        .get(`notifications/user/${userId}/${limit}/${page}`)
        .then(res => res.data),
    fetchById: id => axios.get(`notifications/${id}`).then(res => res.data),
    create: notification =>
      axios
        .post('notifications/new', notification, { headers: headers })
        .then(res => res.data),
    update: notification =>
      axios
        .patch(`notifications/`, notification, { headers: headers })
        .then(res => res.data),
    delete: notificationID =>
      axios
        .patch(
          `notifications/delete`,
          {
            objects: [notificationID],
          },
          { headers: headers },
        )
        .then(res => {
          return res.data;
        }),
  },
  community: {
    updateUserRole: (userId, communityID, userRole) =>
      axios
        .patch(`communities/members`, {
          _id: userId, // required
          role: userRole, // required
          community: communityID, // required
          rejected: false,
        })
        .then(res => res.data),
    removeUserFromCommunity: (userId, communityId) =>
      axios
        .patch(`communities/members`, {
          _id: userId, // required
          community: communityId, // required
          rejected: true,
        })
        .then(res => res.data),
    leaveCommunity: (userId, communityId) =>
      axios
        .patch(`communities/leave`, {
          user: userId, // required
          community: communityId, // required
        })
        .then(res => res.data),

    update: data => axios.patch(`communities`, data).then(res => res.data),

    // Requests
    request: communityRequests,

    // Invitations
    invitation: communityInvitation,
    updateEmployee: data =>
      axios.patch('communities/employee', data).then(res => res.data),
    getDetailsByToken: token =>
      axios.get(`communities/token/${token}`).then(({ data }) => data.data),
  },
  comments: {
    reportComment: data =>
      axios.post(`comments/${data.commentId}/report`, data),
    addParentComment: data => axios.post('comments/new', data),
    editComment: data => axios.patch('comments', data),
    addReplyComment: data => axios.post('comments/answer', data),
    likeComment: data => axios.patch('comments', data),
    hightlightComment: data => axios.patch('comments', data),
    deleteComment: data => axios.patch('comments', data),
  },
  events: {
    getEventById: eventId =>
      axios.get(`https://beemed.com/api/events/${eventId}`),
  },
};

export const setAuthorizationHeader = (token = null) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const setLanguageHeader = lang => {
  axios.defaults.headers['accept-language'] = lang;
};

export default api;
