import FilmPopupView from '../view/popup/popup-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { UpdateType } from '../const.js';

const DOCUMENT_NO_SCROLL_CLASS = 'hide-overflow';

const body = document.body;
const pageFooter = body.querySelector('footer');

export default class FilmPopupPresenter {
  #popupComponent = null;

  #handlePopupClose = null;
  #handleWatchlistUpdate = null;
  #handleWatchedUpdate = null;
  #handleFavoriteUpdate = null;

  #commentsModel = null;
  #film = null;

  constructor (filmsModel, commentsModel, handlePopupClose, handleWatchlistUpdate, handleWatchedUpdate, handleFavoriteUpdate) {
    this.#commentsModel = commentsModel;
    this.#handlePopupClose = handlePopupClose;
    this.#handleWatchlistUpdate = handleWatchlistUpdate;
    this.#handleWatchedUpdate = handleWatchedUpdate;
    this.#handleFavoriteUpdate = handleFavoriteUpdate;
  }

  init = (film) => {
    const prevPopupComponent = this.#popupComponent;

    this.#film = film;
    this.#popupComponent = new FilmPopupView(film, this.#commentsModel, this.#handleModelEvent);

    this.#popupComponent.setCloseButtonClickHandler(this.#handlePopupClose);
    this.#popupComponent.setWatchlistClickHandler(this.#handlePopupWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handlePopupWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handlePopupFavoriteClick);

    document.addEventListener('keydown', this.#popupEscKeydownHandler);
    body.classList.toggle(DOCUMENT_NO_SCROLL_CLASS);

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

  #handleModelEvent = (updateType, data) => {
    const scrollPosition = this.#popupComponent.element.scrollTop;
    switch (updateType) {
      case UpdateType.PATCH:
        this.init(data);
        this.#popupComponent.element.scrollTop = scrollPosition;
        break;
    }
  };

  #handlePopupWatchlistClick = () => {
    const scrollPosition = this.#popupComponent.element.scrollTop;
    this.#handleWatchlistUpdate();
    this.#popupComponent.element.scrollTop = scrollPosition;
  };

  #handlePopupWatchedClick = () => {
    const scrollPosition = this.#popupComponent.element.scrollTop;
    this.#handleWatchedUpdate();
    this.#popupComponent.element.scrollTop = scrollPosition;
  };

  #handlePopupFavoriteClick = () => {
    const scrollPosition = this.#popupComponent.element.scrollTop;
    this.#handleFavoriteUpdate();
    this.#popupComponent.element.scrollTop = scrollPosition;
  };
}

