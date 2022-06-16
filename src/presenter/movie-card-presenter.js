import { render, remove, replace } from '../framework/render.js';
import MoviePopupPresenter from './movie-popup-presenter.js';
import { DOCUMENT_NO_SCROLL_CLASS, UpdateType } from '../const.js';
import MovieCardLinkView from '../view/movies/movie-card/movie-card-link-view.js';
import MovieCardView from '../view/movies/movie-card/movie-card-view.js';
import MovieCardControlsView from '../view/movies/movie-card/movie-card-controls-view.js';

export default class MovieCardPresenter {
  #movie = null;
  #popupPresenter = null;
  #movieCardComponent = null;
  #movieCardLinkComponent = null;
  #movieCardControlsComponent = null;

  #moviesListContainerComponent = null;
  #handleModelEvent = null;
  #moviesModel = null;
  #commentsModel = null;
  #movieCardPresenters = null;
  #movieCardExtraPresenters = null;
  #uiBlocker = null;

  #isPopupOpen = false;

  constructor(moviesListContainerComponent, handleModelEvent, moviesModel, commentsModel, movieCardPresenters, uiBlocker) {
    this.#moviesListContainerComponent = moviesListContainerComponent;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#handleModelEvent = handleModelEvent;
    this.#movieCardPresenters = movieCardPresenters;
    this.#uiBlocker = uiBlocker;
  }

  init = (movie) => {
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movie = movie;

    this.#movieCardComponent = new MovieCardView();
    this.#movieCardLinkComponent = new MovieCardLinkView(movie);
    this.#movieCardControlsComponent = new MovieCardControlsView(this.#movie);

    this.#renderMovieCardLink();
    this.#renderMovieCardControls();

    this.#movieCardLinkComponent.setOpenPopupClickHandler(this.#handlePopupOpenClick);

    this.#movieCardControlsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieCardControlsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardControlsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);

    if (this.#isPopupOpen) {
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
      this.#isPopupOpen = false;
      this.#commentsModel.removeObserver(this.#handlePopupModelEvent);
    }
  };

  #setMovieCardUpdateAborting = () => this.#movieCardControlsComponent.shake();

  #renderMovieCardLink = () => render(this.#movieCardLinkComponent, this.#movieCardComponent.element);

  #renderMovieCardControls = () => render(this.#movieCardControlsComponent, this.#movieCardComponent.element);

  #handleMovieUserDataUpdate = (updateType, update) => {
    try {
      this.#moviesModel.updateMovie(updateType, update);
    } catch (err) {
      if (this.#isPopupOpen) {
        this.#popupPresenter.setMovieUpdateAborting();
        return;
      }
      this.#setMovieCardUpdateAborting();
    }
  };

  #handlePopupOpenClick = () => {
    this.#hidePopup();
    this.#popupPresenter = new MoviePopupPresenter(
      this.#commentsModel,
      this.#hidePopup,
      this.#handleMovieUserDataUpdate,
    );
    this.#commentsModel.init(this.#movie);
    this.#popupPresenter.init(this.#movie);
    this.#isPopupOpen = true;
    this.#commentsModel.addObserver(this.#handlePopupModelEvent);
    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#handlePopupModelEvent);
  };

  #handlePopupModelEvent = (updateType, data) => {
    this.#uiBlocker.block();
    switch (updateType) {
      case UpdateType.MINOR:
        if (this.#movieCardExtraPresenters.get(data.id)) {
          this.#movieCardExtraPresenters.get(data.id).init(data);
        }
        this.#movieCardPresenters.get(data.id).init(data);
        this.#popupPresenter.init(data);
        this.#popupPresenter.setPopupCommentsLoaded();
        break;
      case UpdateType.INIT:
        this.#popupPresenter.init(data);
        this.#popupPresenter.setPopupCommentsLoaded();
        break;
    }
    this.#uiBlocker.unblock();
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

  #hidePopup = () => this.#movieCardPresenters.forEach((presenter) => presenter.hidePopup());
}
