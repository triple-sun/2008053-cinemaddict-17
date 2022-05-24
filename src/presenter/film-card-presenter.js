import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/films/film-card-view.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import { DOCUMENT_NO_SCROLL_CLASS } from '../const.js';
import CommentsModel from '../model/comments-model.js';

export default class FilmCardPresenter {
  #filmComponent = null;
  #filmsListContainerComponent = null;
  #changeData = null;

  #film = null;
  #commentsModel = null;
  #popupPresenter = null;
  #onPopupOpen = null;

  #isPopupOpen = false;

  constructor(filmsListContainerComponent, changeData, onPopupOpen) {
    this.#filmsListContainerComponent = filmsListContainerComponent;
    this.#changeData = changeData;
    this.#onPopupOpen = onPopupOpen;
  }

  init = (film) => {
    const prevFilmComponent = this.#filmComponent;

    this.#film = film;

    this.#commentsModel = new CommentsModel(film);
    this.#filmComponent = new FilmCardView(film);

    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmComponent.setOpenPopupClickHandler(this.#handlePopupOpenClick);

    if (this.#isPopupOpen) {
      this.#popupPresenter.init(film, this.#commentsModel);
    }

    if (!prevFilmComponent) {
      render(this.#filmComponent, this.#filmsListContainerComponent);
      return;
    }

    if (this.#filmsListContainerComponent.contains(prevFilmComponent.element)){
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => remove(this.#filmComponent);

  hidePopup = () => {
    if (this.#popupPresenter) {
      document.body.classList.remove(DOCUMENT_NO_SCROLL_CLASS);
      this.#popupPresenter.destroy();
      this.#isPopupOpen = false;
    }
  };

  #handlePopupOpenClick = () => {
    this.#popupPresenter = new FilmPopupPresenter(this.#changeData, this.hidePopup);

    this.#onPopupOpen();
    this.#popupPresenter.init(this.#film, this.#commentsModel);
    this.#isPopupOpen = true;
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
