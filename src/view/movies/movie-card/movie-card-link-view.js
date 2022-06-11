import AbstractView from '../../../framework/view/abstract-view.js';
import { getReleaseYear, humanizeRuntime } from '../../../utils/movie.js';

const MAX_DESCRIPTION_LENGTH = 140;
const SHORT_DESCRIPTION_LENGTH = 139;
const DESCRIPTION_ELLIPSIS = '...';

const createMovieCardTemplate = (movie) => {
  const {comments, filmInfo} = movie;
  const {title, totalRating, poster, release, runtime, genre, description} = filmInfo;

  const shortDescription = description.length > MAX_DESCRIPTION_LENGTH
    ? description.substring(0, SHORT_DESCRIPTION_LENGTH).trim() + DESCRIPTION_ELLIPSIS
    : description;

  return (`
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
  `);
};

export default class MovieCardLinkView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setOpenPopupClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#openPopupClickHandler);
  };

  #openPopupClickHandler = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this._callback.click();
  };
}
