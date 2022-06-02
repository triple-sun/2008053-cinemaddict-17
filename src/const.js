const CARDS_PER_STEP = 5;
const MAX_FILMS = 9;
const MAX_COMMENTS_TOTAL = 100;
const MAX_COMMENTS_PER_FILM = 10;
const MAX_SENTENCES = 5;
const MIN_YEAR = 1965;
const MAX_YEAR = 2022;

const FILM_CARD_CONTROLS_ACTIVE_CLASS = 'film-card__controls-item--active';
const FILM_POPUP_CONTROLS_ACTIVE_CLASS = 'film-details__control-button--active';
const DOCUMENT_NO_SCROLL_CLASS = 'hide-overflow';

const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];

const MOCK_TITLES = ['Sagebrush Trail', 'Santa Claus Conquers the Martians', 'The Dance of Life', 'The Great Flamarion', 'The Man With the Golden Arm'];

const MOCK_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

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
};

export {
  CARDS_PER_STEP,
  MAX_FILMS,
  MAX_COMMENTS_TOTAL,
  MAX_COMMENTS_PER_FILM,
  MAX_SENTENCES,
  MIN_YEAR,
  MAX_YEAR,
  FILM_CARD_CONTROLS_ACTIVE_CLASS,
  FILM_POPUP_CONTROLS_ACTIVE_CLASS,
  DOCUMENT_NO_SCROLL_CLASS,
  EMOJIS,
  MOCK_TITLES,
  MOCK_SENTENCES,
  FilterType,
  SortType,
  UserAction,
  UpdateType
};
