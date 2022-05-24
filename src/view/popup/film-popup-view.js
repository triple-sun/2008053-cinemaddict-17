import dayjs from 'dayjs';
import AbstractView from '../../framework/view/abstract-view.js';
import { FILM_POPUP_CONTROLS_ACTIVE_CLASS } from '../../const.js';
import { createTemplatesFromArray, humanizeReleaseDate, humanizeRuntime, setUserListButtonActiveClass } from '../../utils/film.js';


const POPUP_CLOSE_BUTTON_CLASS_SELECTOR = '.film-details__close-btn';
const POPUP_WATCHLIST_BUTTON_CLASS_SELECTOR = '.film-details__control-button--watchlist';
const POPUP_WATCHED_BUTTON_CLASS_SELECTOR = '.film-details__control-button--watched';
const POPUP_FAVORITE_BUTTON_CLASS_SELECTOR = '.film-details__control-button--favorite';

const createGenreTemplate = (filmGenre) => `<span class="film-details__genre">${filmGenre}</span>`;

const createCommentTemplate = (filmComment) => {
  const {author, comment, date, emotion} = filmComment;

  return (`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-angry">
    </span>
    <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
    <span class="film-details__comment-author">${author}</span>
    <span class="film-details__comment-day">${dayjs(date).format('hh:mm dddd, MMMM YYYY')}</span>
    <button class="film-details__comment-delete">Delete</button>
  </p>
  </div>
  </li>`);
};

const createFilmPopupTopSectionTemplate = (film, commentsModel) => {
  const {comments, filmInfo, userDetails} = film;
  const {title, poster, ageRating, totalRating, director, writers, actors, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const filmGenres = createTemplatesFromArray([...genre], createGenreTemplate);
  const filmComments = createTemplatesFromArray([...commentsModel.comments], createCommentTemplate);

  return (`
   <section class="film-details">
    <form class="film-details__inner" action="" method="get">
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
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">${filmGenres}</tr>
    </table>

    <p class="film-details__film-description">${description}</p>
  </div>
  </div>

<section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${setUserListButtonActiveClass(watchlist, FILM_POPUP_CONTROLS_ACTIVE_CLASS)}" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched ${setUserListButtonActiveClass(alreadyWatched, FILM_POPUP_CONTROLS_ACTIVE_CLASS)} " id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${setUserListButtonActiveClass(favorite, FILM_POPUP_CONTROLS_ACTIVE_CLASS)}" id="favorite" name="favorite">Add to favorites</button>
</section>
</div>
<div class="film-details__bottom-container">
<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">
  ${filmComments}
  </ul>
  <div class="film-details__new-comment">
  <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
    <label class="film-details__emoji-label" for="emoji-puke">
      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
    </label>
  </div>
  </div>
`);
};

export default class FilmPopupView extends AbstractView {
  #film = null;
  #commentsModel = null;

  constructor(film, commentsModel) {
    super();
    this.#film = film;
    this.#commentsModel = commentsModel;
  }

  get template() {
    return createFilmPopupTopSectionTemplate(this.#film, this.#commentsModel);
  }

  setCloseButtonClickHandler = (cb) => {
    this._callback.click = cb;
    this.element.querySelector(POPUP_CLOSE_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
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

  #watchlistClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.favoriteClick();
  };
}
