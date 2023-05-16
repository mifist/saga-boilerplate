export const routes = {
  main: '/',
  newsfeed: '/newsfeed',
  case: {
    baseUrl: '/case',
    detail: '/case/detail/:id',
  },
  article: {
    baseUrl: '/article',
    detail: '/article/detail/:id',
  },
  podcast: {
    baseUrl: '/podcast',
    detail: '/podcast/detail/:id',
  },
  event: {
    baseUrl: '/event',
    detail: '/event/detail/:id',
  },
  community: {
    baseUrl: '/community',
    detail: '/community/detail/:id',
  },
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    verifyEmail: '/verify-email',
    resetPassword: '/reset-password',
  },
};
