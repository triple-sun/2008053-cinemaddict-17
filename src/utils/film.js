import dayjs from 'dayjs';

const getReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

const humanizeReleaseDate = (releaseDate) => dayjs(releaseDate).format('DD MMM YYYY');

const humanizeRuntime = (minutes) => `${String((minutes / 60).toFixed(2)).replace(/\./gi, 'h ')  }m`;

const humanizeCommentDateTime = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

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

const sortFilmsByDateUp = (filmA, filmB) => {
  const weight = getWeightForNullArrayElement(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmA.filmInfo.release.date).diff(filmB.filmInfo.release.date);
};

const sortFilmsByDateDown = (filmA, filmB) => {
  const weight = getWeightForNullArrayElement(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(filmA.filmInfo.release.date);
};

const sortFilmsByRatingDown = (filmA, filmB) => {
  const weight = getWeightForNullArrayElement(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);

  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};


export {
  getReleaseYear,
  humanizeReleaseDate,
  humanizeRuntime,
  setUserListButtonActiveClass,
  createTemplatesFromArray,
  humanizeCommentDateTime,
  sortFilmsByDefault,
  sortFilmsByDateUp,
  sortFilmsByDateDown,
  sortFilmsByRatingDown
};
