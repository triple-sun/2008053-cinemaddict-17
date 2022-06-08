import { nanoid } from 'nanoid';

const CARDS_PER_STEP = 5;

const MOVIE_CARD_CONTROLS_ACTIVE_CLASS = 'film-card__controls-item--active';
const MOVIE_POPUP_CONTROLS_ACTIVE_CLASS = 'film-details__control-button--active';
const DOCUMENT_NO_SCROLL_CLASS = 'hide-overflow';

const AUTHORIZATION = `Basic ${nanoid(16)}`;
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const pageBody = document.body;
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');


const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  DATE_DOWN: 'date-down',
  RATING: 'rating',
  RATING_DOWN: 'rating-down'
};

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const ErrorType = {
  COMMENTS_ERROR: 'COMMENTS_ERROR'
};

export {
  CARDS_PER_STEP,
  MOVIE_CARD_CONTROLS_ACTIVE_CLASS,
  MOVIE_POPUP_CONTROLS_ACTIVE_CLASS,
  DOCUMENT_NO_SCROLL_CLASS,
  END_POINT,
  AUTHORIZATION,
  pageBody,
  pageHeaderSection,
  pageMainSection,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  ErrorType
};
