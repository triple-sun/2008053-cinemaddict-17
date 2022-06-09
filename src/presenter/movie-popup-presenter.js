import MoviePopupView from '../view/movies/movie-popup-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { DOCUMENT_NO_SCROLL_CLASS, pageBody, pageFooterSection, UpdateType } from '../const.js';

export default class MoviePopupPresenter {
  #movie = null;
  #popupComponent = null;

  #commentsModel = null;
  #handlePopupClose = null;
  #handleMovieUserDataUpdate = null;

  #scrollPosition = null;

  constructor (commentsModel, handlePopupClose, handleMovieUserDataUpdate) {
    this.#commentsModel = commentsModel;
    this.#handlePopupClose = handlePopupClose;
    this.#handleMovieUserDataUpdate = handleMovieUserDataUpdate;
  }

  init = (movie) => {
    const prevPopupComponent = this.#popupComponent;

    this.#movie = movie;
    this.#popupComponent = new MoviePopupView(movie, this.#commentsModel);

    this.#popupComponent.setCloseButtonClickHandler(this.#handlePopupClose);
    this.#popupComponent.setWatchlistClickHandler(this.#handlePopupWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handlePopupWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handlePopupFavoriteClick);

    document.addEventListener('keydown', this.#popupEscKeydownHandler);
    pageBody.classList.toggle(DOCUMENT_NO_SCROLL_CLASS);

    if (!prevPopupComponent) {
      render(this.#popupComponent, pageFooterSection, RenderPosition.AFTEREND);
      return;
    }

    if (pageBody.contains(prevPopupComponent.element)){
      replace(this.#popupComponent, prevPopupComponent);
    }

    if (this.#scrollPosition) {
      this.#popupComponent.element.scrollTop = this.#scrollPosition;
    }

    remove(prevPopupComponent);
  };

  destroy = () => remove(this.#popupComponent);

  #popupEscKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#popupComponent);
      pageBody.classList.remove(DOCUMENT_NO_SCROLL_CLASS);
      document.removeEventListener('keydown', this.#popupEscKeydownHandler);
    }
  };

  #handlePopupWatchlistClick = () => {
    this.#scrollPosition = this.#popupComponent.element.scrollTop;
    this.#handleMovieUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist
        }
      }
    );
  };

  #handlePopupWatchedClick = () => {
    this.#scrollPosition = this.#popupComponent.element.scrollTop;
    this.#handleMovieUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      }
    );
  };

  #handlePopupFavoriteClick = () => {
    this.#scrollPosition = this.#popupComponent.element.scrollTop;
    this.#handleMovieUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite}
      }
    );
  };
}

