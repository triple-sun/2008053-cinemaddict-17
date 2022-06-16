import dayjs from 'dayjs';

const RUNTIME_DIVIDER = 60;
const RUNTIME_STRING_LENGTH = 2;
const RUNTIME_REPLACE_SUFFIX = 'h ';
const RUNTIME_SUFFIX = 'm';

const RELEASE_YEAR_FORMAT = 'YYYY';
const RELEASE_DATE_FORMAT = 'DD MMMM YYYY';

const COMMENT_DATE_FORMAT = 'YYYY/MM/DD HH:mm';

const getReleaseYear = (releaseDate) => dayjs(releaseDate).format(RELEASE_YEAR_FORMAT);

const humanizeReleaseDate = (releaseDate) => dayjs(releaseDate).format(RELEASE_DATE_FORMAT);

const humanizeRuntime = (minutes) => `${String((minutes / RUNTIME_DIVIDER).toFixed(RUNTIME_STRING_LENGTH)).replace(/\./gi, RUNTIME_REPLACE_SUFFIX)  }${RUNTIME_SUFFIX}`;

const humanizeCommentDateTime = (date) => dayjs(date).format(COMMENT_DATE_FORMAT);

const setUserListButtonActiveClass = (userList, controlsClass) => userList ? `${controlsClass}` : '';

const createTemplatesFromArray = (arr, template, join = '') => arr.map(template).join(join);

const getWeightForNullArrayElement = (elemA, elemB) => {
  if (elemA === null && elemB === null) {
    return 0;
  }

  if (elemA === null) {
    return 1;
  }

  if (elemB === null) {
    return -1;
  }

  return null;
};

const sortFilmsByDefault = (filmA, filmB) => filmA.id.toUpperCase() > filmB.id.toUpperCase() ? 1 : -1;

const sortFilmsByDateDown = (filmA, filmB) => {
  const weight = getWeightForNullArrayElement(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(filmA.filmInfo.release.date);
};

const sortFilmsByRatingDown = (filmA, filmB) => {
  const weight = getWeightForNullArrayElement(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);

  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};

const sortMoviesByCommentsCount = (filmA, filmB) => {
  const weight = getWeightForNullArrayElement(filmA.comments.length, filmB.comments.length);

  return weight ?? filmB.comments.length - filmA.comments.length;
};

export {
  getReleaseYear,
  humanizeReleaseDate,
  humanizeRuntime,
  setUserListButtonActiveClass,
  createTemplatesFromArray,
  humanizeCommentDateTime,
  sortFilmsByDefault,
  sortFilmsByDateDown,
  sortFilmsByRatingDown,
  sortMoviesByCommentsCount,
};
