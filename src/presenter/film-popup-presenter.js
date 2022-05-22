import FilmPopupView from '../view/popup/film-popup-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';

const DOCUMENT_NO_SCROLL_CLASS = 'hide-overflow';

const body = document.body;
const pageFooter = body.querySelector('footer');

export default class FilmPopupPresenter {
  #popupComponent = null;
  #changeData = null;
  #onClose = null;
  #film = null;

  constructor (changeData, onClose) {
    this.#changeData = changeData;
    this.#onClose = onClose;
  }

  init = (film) => {
    const prevPopupComponent = this.#popupComponent;

    this.#film = film;
    this.#popupComponent = new FilmPopupView(film);

    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setCloseButtonClickHandler(this.#onClose);

    document.addEventListener('keydown', this.#popupEscKeydownHandler);
    body.classList.add(DOCUMENT_NO_SCROLL_CLASS);

    if (!prevPopupComponent) {
      render(this.#popupComponent, pageFooter, RenderPosition.AFTEREND);
      return;
    }

    if (body.contains(prevPopupComponent.element)){
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
  };

  destroy = () => remove(this.#popupComponent);

  #popupEscKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#popupComponent);
      body.classList.remove(DOCUMENT_NO_SCROLL_CLASS);
      document.removeEventListener('keydown', this.#popupEscKeydownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite}
    });
  };

  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      }
    });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      }
    });
  };
}

