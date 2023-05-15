// utils/generalHelper.js
import moment from 'moment';

const getUrlVars = () => {
  const vars = {};
  const parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function(m, key, value) {
      vars[key] = value;
    },
  );
  return vars;
};

// remove empty object items
const clean = obj => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

/*
 * Returns a function which will sort an
 * array of objects by the given key.
 */
const sortByKey = (key, reverse) => {
  // Move smaller items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  const moveSmaller = reverse ? 1 : -1;

  // Move larger items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  const moveLarger = reverse ? -1 : 1;

  /**
   * @param  {*} a
   * @param  {*} b
   * @return {Number}
   */
  return (a, b) => {
    if (a.hasOwnProperty(key)) {
      if (a[key] < b[key]) {
        return moveSmaller;
      }
      if (a[key] > b[key]) {
        return moveLarger;
      }
    }
    return 0;
  };
};

const hasUrl = text => {
  const urlFindRegex = /((https?|ftp)\:\/\/)?([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?([a-z0-9-.]*)\.([a-z]{2,3})(\:[0-9]{2,5})?(\/([a-z0-9+\$_\-~@\(\)\%]\.?)+)*\/?(\?[a-z+&\$_.-][a-z0-9;:@&#%=+\/\$_.-]*)?(#[a-z_.-][a-z0-9+\$_.-]*)?/i;
  return urlFindRegex.test(text);
};

const urlify = text => {
  // search for http , https , ftp , and file URLs.
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, url => `<a href="${url}">${url}</a>`);
};

/**
 * Truncate a string over a given length and add ellipsis if necessary
 * @param {string} str - string to be truncated
 * @param {integer} limit - max length of the string before truncating
 * @return {string} truncated string
 */
const truncate = function(str, limit) {
  return str.length < limit
    ? str
    : str.substring(0, limit).replace(/\w{3}$/gi, '...');
};

function removeTags(str) {
  if (str === null || str === '') return false;
  str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, '');
}

/**
 * Returns the first `limit` characters from the given `string`.
 *
 * @param {String} string
 * @param {Number} limit
 *
 * @returns {String}
 */
function limit(string = '', limit = 0) {
  const str = removeTags(string);
  return str && str.substring(0, limit);
}

function getArrayIds(array) {
  const idsArray = [];
  if (array && Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      if (typeof array[i] === 'object') {
        idsArray[i] = array[i]._id;
      } else {
        idsArray[i] = array[i];
      }
    }
  }
  return idsArray;
}

function ArrayEquals(arr1, arr2) {
  if (arr1.length === arr2.length) {
    return (
      arr1.every(v => arr2.includes(v)) && arr2.every(v => arr1.includes(v))
    );
  }
  return false;
}
function objectsAreSame(x, y) {
  let objectsAreSame = true;
  for (const propertyName in x) {
    if (x[propertyName] !== y[propertyName]) {
      objectsAreSame = false;
      break;
    }
  }
  return objectsAreSame;
}

const objectsEqual = (o1, o2) =>
  Object.keys(o1).length === Object.keys(o2).length &&
  Object.keys(o1).every(p => o1[p] === o2[p]);

const arraysObjEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

function ArrayEquals2(arr1, arr2) {
  return (
    arr1.length === arr2.length &&
    !arr1.some(v => arr2.includes(v)) &&
    !arr2.some(v => arr1.includes(v))
  );
}

function getObjId(dataObj) {
  let currentId = '';
  if (dataObj) {
    if (typeof dataObj === 'object') {
      currentId = dataObj?._id;
    } else {
      currentId = dataObj;
    }
  }
  return currentId;
}

// converts number to string representation with K and M.
// toFixed(d) returns a string that has exactly 'd' digits
// after the decimal place, rounding if necessary.
function numFormatter(num) {
  if (num > 999 && num < 1000000) {
    return `${(num / 1000).toFixed(1)}k`; // convert to K for number from > 1000 < 1 million
  }
  if (num > 1000000) {
    return `${(num / 1000000).toFixed(1)}m`; // convert to M for number from > 1 million
  }
  if (num <= 999) {
    return `${num}`; // if value < 1000, nothing to do
  }
}

const membersAmount = (community, formated = true) => {
  const allMembers = community ? getUniqueMembers(community) : [];
  const amount = allMembers.length;
  return formated ? numFormatter(amount) : amount;
};

const getUniqueMembers = communityInfo => {
  let membersConcat = [];

  membersConcat =
    communityInfo?.admins !== undefined
      ? membersConcat.concat(communityInfo?.admins)
      : [];
  membersConcat =
    communityInfo?.moderators !== undefined
      ? membersConcat.concat(communityInfo?.moderators)
      : [];
  membersConcat =
    communityInfo?.members !== undefined
      ? membersConcat.concat(communityInfo?.members)
      : [];

  const uniqueArr = membersConcat ? Array.from(new Set(membersConcat)) : [];

  return arrayUniqueByKey(uniqueArr);
};

const gindUserInRole = (communityInfo, user) => {
  const userId = getObjId(user);
  const admins = communityInfo?.admins
    ? communityInfo?.admins.filter(el => getObjId(el) !== userId)
    : [];
  const moderators = communityInfo?.moderators
    ? communityInfo?.moderators.filter(el => getObjId(el) !== userId)
    : [];
  const members = communityInfo?.members
    ? communityInfo?.members.filter(el => getObjId(el) !== userId)
    : [];

  return {
    admins,
    moderators,
    members,
  };
};

const arrayUniqueByKey = (array, key = '_id') =>
  array && array?.length > 0
    ? [...new Map(array?.map(item => [item[key], item])).values()]
    : [];

function getUniqueArray(_array) {
  const obj = {};
  const uniqueArray = [];
  for (let i = 0; i < _array.length; i++) {
    if (obj[_array[i]] == undefined) {
      // add the array elements to object , where the element is key and the same element is value
      // keys of the object can only have unique values
      obj[_array[i]] = i;
      // add the keys of the object to a new array as elements of the array
      uniqueArray.push(_array[i]);
    }
  }
  return uniqueArray;
}

function convertRequestToUsersRolesArr(_array) {
  const roles = {
    admins: [],
    moderators: [],
    members: [],
  };
  for (let i = 0; i < _array.length; i++) {
    if (_array[i]?.role && !_array[i]?.processed && !_array[i]?.rejected) {
      roles[_array[i]?.role + 's'].push({
        ..._array[i]?.user,
        requestId: _array[i]._id,
        role: _array[i]?.role,
      });
    }
  }

  return roles;
}

const isUserAnAdmin = (user, members) => {
  const userId = getObjId(user);
  const isAdmin =
    members?.admins &&
    members?.admins.findIndex(el => getObjId(el) == userId) !== -1;
  return isAdmin;
};

// check if coming from newsfeed, profile, if yes, don't display the next button
const isNextDisplayed = history => {
  if (
    history?.location?.state?.goBackName === 'common.backToFeed' ||
    history?.location?.state?.goBackName === 'profile.backToProfile' ||
    history?.location?.state?.goBackName ===
      'notifications.backToNotifications' ||
    !history?.location?.state?.goBackName
  ) {
    return false;
  } else {
    return true;
  }
};

// this is for converting an object to query params. e.g sort=date&type=public
const makeSearchQueryParams = initialFilter =>
  Object.keys(initialFilter)
    .map(key => initialFilter[key] && `${key}=${initialFilter[key]}`)
    .filter(Boolean)
    .join('&');

const getEmployment = user => {
  let employment = { isEmployee: false, industryName: null };

  if (
    user.employment &&
    user.employment.isEmployee &&
    user.role !== 'industry'
  ) {
    employment.isEmployee = true;

    if (
      Array.isArray(user.employment.industryCommunity) &&
      user.employment.industryCommunity.length > 0
    ) {
      employment.industryName = user.employment.industryCommunity[0]?.title;
    } else {
      employment.industryName = user.employment.industryCommunity.title;
    }
  } else {
    employment.isEmployee = false;
    employment.industryName = null;
  }

  return employment;
};

const getEventTitle = ({ dateFrom, hour }) => {
  return (
    moment(dateFrom).format('Do MMM YYYY') +
    (hour ? ' | ' + hour.substring(0, 5).concat(' (CET)') : '')
  );
};

const getCommentsCount = comments => {
  let count = 0;

  comments.forEach(comment => {
    count++;
    if (comment.answers && comment.answers.length > 0) {
      comment.answers?.forEach(answer => {
        count++;
      });
    }
  });

  return count;
};

export {
  clean,
  sortByKey,
  hasUrl,
  urlify,
  truncate,
  getObjId,
  getArrayIds,
  ArrayEquals,
  objectsAreSame,
  objectsEqual,
  arraysObjEqual,
  limit,
  numFormatter,
  membersAmount,
  getUniqueMembers,
  makeSearchQueryParams,
  getUrlVars,
  isUserAnAdmin,
  getUniqueArray,
  arrayUniqueByKey,
  gindUserInRole,
  convertRequestToUsersRolesArr,
  isNextDisplayed,
  getEmployment,
  getEventTitle,
  getCommentsCount,
};
