'use strict';

const BASE_API = process.env.LOCAL_BACKEND || process.env.LOCAL_HOST || 'localhost'; 
const BASE_NAME = process.env.BASE_NAME || '';

module.exports = {
  BASE_API: BASE_API,
  API_URL: `http://${BASE_API.toString()}:8080/api/`,
  HOSTING_URL: `http://localhost:3000/`,
};