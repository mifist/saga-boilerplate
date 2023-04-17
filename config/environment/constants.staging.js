'use strict';

const BASE_API = process.env.LOCAL_BACKEND || process.env.LOCAL_HOST || 'localhost'; 
const BASE_NAME = process.env.BASE_NAME || '';

module.exports = {
  BASE_API: BASE_API,
  API_URL: `https://${BASE_NAME}.herokuapp.com/api/`,
  HOSTING_URL: `https://beta.${BASE_NAME}.com/`,
};