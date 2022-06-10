import { render, remove, replace } from '../framework/render.js';
import MovieCardView from '../view/movies/movie-card-view.js';
import MoviePopupPresenter from './movie-popup-presenter.js';
import { DOCUMENT_NO_SCROLL_CLASS, UpdateType } from '../const.js';

export default class MovieCardPresenter {
  #movie = null;
  #popupPresenter = null;
  #movieCardComponent = null;

  #moviesListContainerComponent = null;
  #handleModelEvent = null;
  #handleMovieUserDataUpdate = null;
  #hidePopup = null;

  #moviesModel = null;
  #commentsModel = null;
  #movieCardPresenters = null;

  #isPopupOpen = false;

  constructor(moviesListContainerComponent, handleMovieUserDataUpdate, handleModelEvent, hidePopup, moviesModel, commentsModel, movieCardPresenters) {
    this.#moviesListContainerComponent = moviesListContainerComponent;
    this.#handleMovieUserDataUpdate = handleMovieUserDataUpdate;
    this.#hidePopup = hidePopup;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#handleModelEvent = handleModelEvent;
    this.#movieCardPresenters = movieCardPresenters;

  }

  init = (movie) => {
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movie = movie;
    this.#movieCardComponent = new MovieCardView(movie);

    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieCardComponent.setOpenPopupClickHandler(this.#handlePopupOpenClick);

    if (this.#isPopupOpen) {
      this.#commentsModel.init(movie);
      this.#popupPresenter.init(this.#movie);
    }

    if (!prevMovieCardComponent) {
      render(this.#movieCardComponent, this.#moviesListContainerComponent);
      return;
    }

    if (this.#moviesListContainerComponent.contains(prevMovieCardComponent.element)){
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);
  };

  destroy = () => remove(this.#movieCardComponent);

  hidePopup = () => {
    if (this.#popupPresenter) {
      document.body.classList.remove(DOCUMENT_NO_SCROLL_CLASS);
      this.#popupPresenter.destroy();
      this.#moviesModel.removeObserver(this.#handlePopupModelEvent);
      this.#commentsModel.removeObserver(this.#handlePopupModelEvent);
      this.#moviesModel.addObserver(this.#handleModelEvent);
      this.#isPopupOpen = false;
    }
  };

  #handlePopupModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#popupPresenter.init(this.#movie);
        break;
      case UpdateType.MINOR:
        this.#movieCardPresenters.get(data.id).init(data);
        this.#popupPresenter.init(data);
        break;
      case UpdateType.INIT:
        this.#popupPresenter.init(data);
        break;
    }
  };

  #handlePopupOpenClick = () => {
    this.#commentsModel.init(this.#movie);
    this.#hidePopup();
    this.#popupPresenter = new MoviePopupPresenter(
      this.#commentsModel,
      this.hidePopup,
      this.#handleMovieUserDataUpdate
    );
    this.#popupPresenter.init(this.#movie);
    this.#isPopupOpen = true;
    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#handlePopupModelEvent);
    this.#commentsModel.addObserver(this.#handlePopupModelEvent);
  };

  #handleWatchlistClick = () => {
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist
        }
      }
    );
  };

  #handleAlreadyWatchedClick = () => {
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      });
  };

  #handleFavoriteClick = () => {
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite}
      }
    );
  };
}
