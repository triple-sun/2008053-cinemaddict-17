import AbstractView from '../../framework/view/abstract-view.js';
import { getReleaseYear, humanizeRuntime, setUserListButtonActiveClass } from '../../utils/movie.js';
import { MOVIE_CARD_CONTROLS_ACTIVE_CLASS } from '../../const.js';

const MAX_DESCRIPTION_LENGTH = 140;
const SHORT_DESCRIPTION_LENGTH = 139;
const DESCRIPTION_ELLIPSIS = '...';

const MOVIE_CARD_LINK_CLASS_SELECTOR = '.film-card__link';
const MOVIE_CARD_CONTROLS_WATCHLIST_CLASS_SELECTOR = '.film-card__controls-item--add-to-watchlist';
const MOVIE_CARD_CONTROLS_WATCHED_CLASS_SELECTOR = '.film-card__controls-item--mark-as-watched';
const MOVIE_CARD_CONTROLS_FAVORITE_CLASS_SELECTOR = '.film-card__controls-item--favorite';

const createMovieCardTemplate = (movie) => {
  const {comments, filmInfo, userDetails} = movie;
  const {title, totalRating, poster, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const shortDescription = description.length > MAX_DESCRIPTION_LENGTH
    ? description.substring(0, SHORT_DESCRIPTION_LENGTH).trim() + DESCRIPTION_ELLIPSIS
    : description;

  return (`
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getReleaseYear(release.date)}</span>
          <span class="film-card__duration">${humanizeRuntime(runtime)}</span>
          <span class="film-card__genre">${genre.join(', ')}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${shortDescription}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${setUserListButtonActiveClass(watchlist, MOVIE_CARD_CONTROLS_ACTIVE_CLASS)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${setUserListButtonActiveClass(alreadyWatched, MOVIE_CARD_CONTROLS_ACTIVE_CLASS)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${setUserListButtonActiveClass(favorite, MOVIE_CARD_CONTROLS_ACTIVE_CLASS)}" type="button">Mark as favorite</button>
      </div>
    </article>
  `);
};

export default class MovieCardView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get movie() {
    return this.#movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setOpenPopupClickHandler = (cb) => {
    this._callback.click = cb;
    this.element.querySelector(MOVIE_CARD_LINK_CLASS_SELECTOR).addEventListener('click', this.#openPopupClickHandler);
  };

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

  #openPopupClickHandler = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this._callback.click();
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
