import { MOVIE_POPUP_CONTROLS_ACTIVE_CLASS} from '../../const.js';
import { createTemplatesFromArray, humanizeReleaseDate, humanizeRuntime, setUserListButtonActiveClass } from '../../utils/movie.js';
import AbstractView from '../../framework/view/abstract-stateful-view.js';

const SINGLE_GENRE = 1;

const POPUP_CLOSE_BUTTON_CLASS_SELECTOR = '.film-details__close-btn';
const POPUP_WATCHLIST_BUTTON_CLASS_SELECTOR = '.film-details__control-button--watchlist';
const POPUP_WATCHED_BUTTON_CLASS_SELECTOR = '.film-details__control-button--watched';
const POPUP_FAVORITE_BUTTON_CLASS_SELECTOR = '.film-details__control-button--favorite';

const createGenreTemplate = (movieGenre) => `<span class="film-details__genre">${movieGenre}</span>`;

const createMoviePopupTopSectionTemplate = (movie) => {
  const {filmInfo, userDetails} = movie;
  const {title, poster, ageRating, totalRating, director, writers, actors, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const filmGenres = createTemplatesFromArray([...genre], createGenreTemplate);

  const genreNoun = genre.length > SINGLE_GENRE
    ? 'Genres'
    : 'Genre';


  return (`
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
             <img class="film-details__poster-img" src="${poster}" alt="">

             <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">${title}</h3>
        <p class="film-details__title-original">Original: ${title}</p>
      </div>

      <div class="film-details__rating">
        <p class="film-details__total-rating">${totalRating}</p>
      </div>
    </div>

    <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${director}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${writers.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${humanizeReleaseDate(release.date)}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${humanizeRuntime(runtime)}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${release.releaseCountry}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">${genreNoun}</td>
        <td class="film-details__cell">${filmGenres}</td>
      </tr>
    </table>

    <p class="film-details__film-description">${description}</p>
  </div>
  </div>

<section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${setUserListButtonActiveClass(watchlist, MOVIE_POPUP_CONTROLS_ACTIVE_CLASS)}" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched ${setUserListButtonActiveClass(alreadyWatched, MOVIE_POPUP_CONTROLS_ACTIVE_CLASS)} " id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${setUserListButtonActiveClass(favorite, MOVIE_POPUP_CONTROLS_ACTIVE_CLASS)}" id="favorite" name="favorite">Add to favorites</button>
</section>
</div>
`);
};

export default class MoviePopupTopContainerView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMoviePopupTopSectionTemplate(this.#movie);
  }

  _restoreHandlers = () => {
    this.setCloseButtonClickHandler(this.#closeButtonClickHandler);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector(POPUP_CLOSE_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#closeButtonClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector(POPUP_WATCHLIST_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector(POPUP_WATCHED_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector(POPUP_FAVORITE_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#favoriteClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
