import dayjs from 'dayjs';
import { humanizeCommentDateTime } from './movie';

//https://stackoverflow.com/a/59769834
const convertStringToCamelCase = (str) => str
  .replace(
    /([-_][a-z])/ig, ($1) => $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

const convertStringToSnakeCase = (str) => str
  .replace(
    /([A-Z])/g, ($1)=> `_${$1
      .toLowerCase()}`
  );

const checkIfIsObject = (obj) => obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';

const convertSnakeCaseKeysToCamelCase = (obj) => {
  if (checkIfIsObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[convertStringToCamelCase(k)] = convertSnakeCaseKeysToCamelCase(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => convertSnakeCaseKeysToCamelCase(i));
  }

  return obj;
};

const convertCamelCaseKeysToSnakeCase = (obj) => {
  if (checkIfIsObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[convertStringToSnakeCase(k)] = convertCamelCaseKeysToSnakeCase(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => convertCamelCaseKeysToSnakeCase(i));
  }

  return obj;
};

const getDateDifference = (units, date) => dayjs().diff(date, units);

const humanizeCommentDate = (date) => {
  const commentDate = dayjs(date);

  if (getDateDifference('minutes', commentDate) < 1) {
    return 'Now';
  }

  if (getDateDifference('hours', commentDate) < 1) {
    return 'A few minutes ago';
  }

  if (getDateDifference('days', commentDate) < 1) {
    return 'A few hours ago';
  }

  if (getDateDifference('months', commentDate) < 1) {
    if (getDateDifference('days', commentDate) === 1){
      return 'A day ago';
    }
    if (getDateDifference('days', commentDate) > 1) {
      return `${getDateDifference('days', commentDate)} days ago`;
    }
  }

  if (getDateDifference('years', commentDate) < 1) {
    if (getDateDifference('months', commentDate) === 1){
      return 'A month ago';
    }
    if (getDateDifference('months', commentDate) > 1) {
      return `${getDateDifference('months', commentDate)} months ago`;
    }
  }

  if (getDateDifference('years', commentDate) > 1) {
    if (getDateDifference('years', commentDate) === 1){
      return 'A year ago';
    }
    if (getDateDifference('years', commentDate) > 1) {
      return `${getDateDifference('year', commentDate)} years ago`;
    }
  }

  return humanizeCommentDateTime(date);
};

const findItemIndex = (arr, itemToFind) => arr.findIndex((item) => item === itemToFind);

export {
  convertSnakeCaseKeysToCamelCase,
  convertCamelCaseKeysToSnakeCase,
  humanizeCommentDate,
  findItemIndex
};
