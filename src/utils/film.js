import dayjs from 'dayjs';

const getReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

const humanizeReleaseDate = (releaseDate) => dayjs(releaseDate).format('DD MMM YYYY');

const humanizeRuntime = (minutes) => `${String((minutes / 60).toFixed(2)).replace(/\./gi, 'h ')  }m`;

const humanizeCommentDateTime = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

const setUserListButtonActiveClass = (userList, controlsClass) => userList ? `${controlsClass}` : '';

const createTemplatesFromArray = (arr, template, join = '') => arr.map(template).join(join);

export {getReleaseYear, humanizeReleaseDate, humanizeRuntime, setUserListButtonActiveClass, createTemplatesFromArray, humanizeCommentDateTime};
