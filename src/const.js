import { nanoid } from 'nanoid';

const CARDS_PER_STEP = 5;

const MOVIE_CARD_CONTROLS_ACTIVE_CLASS = 'film-card__controls-item--active';
const MOVIE_POPUP_CONTROLS_ACTIVE_CLASS = 'film-details__control-button--active';
const DOCUMENT_NO_SCROLL_CLASS = 'hide-overflow';

const AUTHORIZATION = `Basic ${nanoid(16)}`;
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const FilterName = {
  ALL: 'All Movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  DATE_DOWN: 'date-down',
  RATING_DOWN: 'rating-down',
};

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  FAIL: 'FAIL',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const ExtraCategory = {
  TOP_RATED: 'Top Rated',
  MOST_COMMENTED: 'Most Commented',
};

const TimeUnit = {
  MINUTE: 'minutes',
  HOUR: 'hours',
  DAY: 'days',
  MONTH: 'months',
  YEAR: 'years'
};

const pageBody = document.querySelector('body');
const pageHeaderSection = pageBody.querySelector('header');
const pageMainSection = pageBody.querySelector('main');
const pageFooterSection = pageBody.querySelector('footer');

export {
  CARDS_PER_STEP,
  MOVIE_CARD_CONTROLS_ACTIVE_CLASS,
  MOVIE_POPUP_CONTROLS_ACTIVE_CLASS,
  DOCUMENT_NO_SCROLL_CLASS,
  END_POINT,
  AUTHORIZATION,
  FilterName,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  TimeLimit,
  ExtraCategory,
  TimeUnit,
  pageBody,
  pageHeaderSection,
  pageMainSection,
  pageFooterSection
};
