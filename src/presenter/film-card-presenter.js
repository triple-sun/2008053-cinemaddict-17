import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/films/film-card-view.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import { DOCUMENT_NO_SCROLL_CLASS, UpdateType } from '../const.js';
import CommentsModel from '../model/comments-model.js';

export default class FilmCardPresenter {
  #filmComponent = null;
  #filmsListContainerComponent = null;
  #handleFilmUserDataUpdate = null;
  #filmsModel = null;
  #handleModelEvent = null;

  #film = null;
  #commentsModel = null;
  #popupPresenter = null;
  #hidePopup = null;

  #isPopupOpen = false;

  constructor(filmsListContainerComponent, handleFilmUserDataUpdate, hidePopup, filmsModel, handleModelEvent) {
    this.#filmsListContainerComponent = filmsListContainerComponent;
    this.#handleFilmUserDataUpdate = handleFilmUserDataUpdate;
    this.#hidePopup = hidePopup;
    this.#filmsModel = filmsModel;
    this.#handleModelEvent = handleModelEvent;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = (film) => {
    const prevFilmComponent = this.#filmComponent;

    this.#film = film;
    this.#filmComponent = new FilmCardView(film);
    this.#commentsModel = new CommentsModel(film);

    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmComponent.setOpenPopupClickHandler(this.#handlePopupOpenClick);

    if (this.#isPopupOpen) {
      this.#popupPresenter.init(film, this.#commentsModel, this.#filmsModel);
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
    this.#hidePopup();
    this.#popupPresenter = new FilmPopupPresenter(
      this.#filmsModel,
      this.#commentsModel,
      this.hidePopup,
      this.#handleWatchlistClick,
      this.#handleAlreadyWatchedClick,
      this.#handleFavoriteClick,
    );
    this.#popupPresenter.init(this.#film);
    this.#isPopupOpen = true;
  };

  #handleFavoriteClick = () => {
    this.#handleFilmUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite}
      }
    );
  };

  #handleWatchlistClick = () => {
    this.#handleFilmUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        }
      }
    );
  };

  #handleAlreadyWatchedClick = () => {
    this.#handleFilmUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      });
  };

  #handleCommentDelete = () => {
    this.#handleFilmUserDataUpdate(
      UpdateType.PATCH,
      {

      }
    );
  };
}
