import dayjs from 'dayjs';
import { TimeUnit } from '../const';
import { humanizeCommentDateTime } from './movie';

const COMMENT_TIME_NOW = 'Now';
const COMMENT_TIME_MINUTES_AGO = 'A few minutes ago';
const COMMENT_TIME_HOURS_AGO = 'A few hours ago';
const COMMENT_TIME_DAY_AGO = 'A day ago';
const COMMENT_TIME_DAYS_AGO = 'days ago';
const COMMENT_TIME_MONTH_AGO = 'A month ago';
const COMMENT_TIME_MONTHS_AGO = 'months ago';
const COMMENT_TIME_YEAR_AGO = 'A year ago';
const COMMENT_TIME_YEARS_AGO = 'years ago';

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

  if (getDateDifference(TimeUnit.MINUTE, commentDate) < 1) {
    return COMMENT_TIME_NOW;
  }

  if (getDateDifference(TimeUnit.MINUTE, commentDate) < 1) {
    return COMMENT_TIME_MINUTES_AGO;
  }

  if (getDateDifference(TimeUnit.DAY, commentDate) < 1) {
    return COMMENT_TIME_HOURS_AGO;
  }

  if (getDateDifference(TimeUnit.MONTH, commentDate) < 1) {
    if (getDateDifference(TimeUnit.DAY, commentDate) === 1){
      return COMMENT_TIME_DAY_AGO;
    }
    if (getDateDifference(TimeUnit.DAY, commentDate) > 1) {
      return `${getDateDifference(TimeUnit.DAY, commentDate)} ${COMMENT_TIME_DAYS_AGO}`;
    }
  }

  if (getDateDifference(TimeUnit.YEAR, commentDate) < 1) {
    if (getDateDifference(TimeUnit.MONTH, commentDate) === 1){
      return COMMENT_TIME_MONTH_AGO;
    }
    if (getDateDifference(TimeUnit.MONTH, commentDate) > 1) {
      return `${getDateDifference(TimeUnit.MONTH, commentDate)} ${COMMENT_TIME_MONTHS_AGO}`;
    }
  }

  if (getDateDifference(TimeUnit.YEAR, commentDate) > 1) {
    if (getDateDifference(TimeUnit.YEAR, commentDate) === 1){
      return COMMENT_TIME_YEAR_AGO;
    }
    if (getDateDifference(TimeUnit.YEAR, commentDate) > 1) {
      return `${getDateDifference(TimeUnit.YEAR, commentDate)} ${COMMENT_TIME_YEARS_AGO}`;
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
