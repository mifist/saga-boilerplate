/* eslint-disable */

// request wrapper for POST, GET, PUT, DELETE REQUESTS
import { call } from 'redux-saga/effects'; // eslint-disable-line
import request from 'utils/request';
// utils
// import { getBaseApiUrl } from 'appCapacitor/helpers';

export default function* requestWrapper(
  type,
  route,
  body,
  token,
  url = 'schoolinked',
  bearer = false,
) {
  // Workaround for prevent UnauthorizedError from backend
 // token = null;

  let apiURL = '';
  let requestURL;

  // tcf api here
  if (url === 'schoolinked') {
    requestURL = `${apiURL}${route}`;
  }

  /*  console.debug('REQUEST WRAPPER')
  console.debug(apiURL);
  console.debug(requestURL); */


  // modify headers
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // with token
  if (token) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token,
    };
  }
  if (bearer){
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + bearer,
    };
  }

  switch (type) {
    case 'POST':
      return yield call(request, requestURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
    
    case 'GET':
      return yield call(request, requestURL, {
        method: 'GET',
        headers: headers,
      });
    
    case 'POST-FORM-DATA':
      return yield call(request, requestURL, {
        method: 'POST',
        body: body,
        headers: {
          Authorization: 'Token ' + token,
        },
      });
    
    case 'PATCH-FORM-DATA':
      return yield call(request, requestURL, {
        method: 'PATCH',
        headers: {
          Authorization: 'Token ' + token,
        },
        body: body,
      });
    
    case 'PATCH':
      return yield call(request, requestURL, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(body),
      });
      
    case 'DELETE':
      return yield call(request, requestURL, {
        method: 'DELETE',
        headers: headers,
      });
      
    // TODO: DELETE ?
  }
}
