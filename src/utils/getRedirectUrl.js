import {
  PRODUCTION_HOSTING_URL,
  STAGING_HOSTING_URL,
  DEVELOPMENT_HOSTING_URL,
} from 'utils/constants';

export const getRedirectUrl = () => {
  let urlOauth = 'https://beemed.com/oauth/authorize?client_id=';
  let client_id = 5;
  let redirect_uri = `${DEVELOPMENT_HOSTING_URL}oauth`;
  let redirectUrl = `${urlOauth}${client_id}&response_type=code&redirect_uri=${redirect_uri}`;

  if (
    process.env.BASE_ENV === 'production' ||
    process.env.BASE_ENV === 'staging'
  ) {
    if (window.location.origin.includes('app.beemed.com')) {
      client_id = 8;
      redirect_uri = `${PRODUCTION_HOSTING_URL}oauth`;
      redirectUrl = `${urlOauth}${client_id}&response_type=code&redirect_uri=${redirect_uri}`;
    } else {
      client_id = 7;
      redirect_uri = `${STAGING_HOSTING_URL}oauth`;
      redirectUrl = `${urlOauth}${client_id}&response_type=code&redirect_uri=${redirect_uri}`;
    }
  }

  return redirectUrl
}
