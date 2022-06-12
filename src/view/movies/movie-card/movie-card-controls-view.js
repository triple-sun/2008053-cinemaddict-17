import { setUserListButtonActiveClass } from '../../../utils/movie.js';
import { MOVIE_CARD_CONTROLS_ACTIVE_CLASS } from '../../../const.js';
import AbstractView from '../../../framework/view/abstract-view.js';

const MOVIE_CARD_CONTROLS_WATCHLIST_CLASS_SELECTOR = '.film-card__controls-item--add-to-watchlist';
const MOVIE_CARD_CONTROLS_WATCHED_CLASS_SELECTOR = '.film-card__controls-item--mark-as-watched';
const MOVIE_CARD_CONTROLS_FAVORITE_CLASS_SELECTOR = '.film-card__controls-item--favorite';

const createMovieCardTemplate = (movie) => {
  const {userDetails} = movie;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  return (`
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${setUserListButtonActiveClass(watchlist, MOVIE_CARD_CONTROLS_ACTIVE_CLASS)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${setUserListButtonActiveClass(alreadyWatched, MOVIE_CARD_CONTROLS_ACTIVE_CLASS)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${setUserListButtonActiveClass(favorite, MOVIE_CARD_CONTROLS_ACTIVE_CLASS)}" type="button">Mark as favorite</button>
      </div>
  `);
};

export default class MovieCardControlsView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector(MOVIE_CARD_CONTROLS_WATCHLIST_CLASS_SELECTOR).addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector(MOVIE_CARD_CONTROLS_WATCHED_CLASS_SELECTOR).addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector(MOVIE_CARD_CONTROLS_FAVORITE_CLASS_SELECTOR).addEventListener('click', this.#favoriteClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.favoriteClick();
  };
}
