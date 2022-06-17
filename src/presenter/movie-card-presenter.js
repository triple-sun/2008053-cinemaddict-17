import { render, remove, replace } from '../framework/render.js';
import MoviePopupPresenter from './movie-popup-presenter.js';
import { DOCUMENT_NO_SCROLL_CLASS, FilterType, pageBody, UpdateType } from '../const.js';
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
  #filterModel = null;

  #movieCardPresenters = null;
  #uiBlocker = null;
  #updateMovieCardsBoard = null;

  #isPopupOpen = false;

  constructor(
    moviesListContainerComponent,
    handleModelEvent,
    moviesModel,
    commentsModel,
    filterModel,
    movieCardPresenters,
    uiBlocker,
    updateMovieCardsBoard
  ) {
    this.#moviesListContainerComponent = moviesListContainerComponent;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#handleModelEvent = handleModelEvent;
    this.#movieCardPresenters = movieCardPresenters;
    this.#uiBlocker = uiBlocker;
    this.#updateMovieCardsBoard = updateMovieCardsBoard;
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
      pageBody.classList.remove(DOCUMENT_NO_SCROLL_CLASS);

      this.#popupPresenter.destroy();

      this.#isPopupOpen = false;

      this.#commentsModel.removeObserver(this.#handlePopupModelEvent);
      this.#moviesModel.removeObserver(this.#handlePopupModelEvent);

      this.#moviesModel.addObserver(this.#handleModelEvent);
    }
  };

  #setMovieCardUpdateAborting = () => this.#movieCardComponent.shake();

  #renderMovieCardLink = () => render(this.#movieCardLinkComponent, this.#movieCardComponent.element);

  #renderMovieCardControls = () => render(this.#movieCardControlsComponent, this.#movieCardComponent.element);

  #handleMovieUserDataUpdate = async (updateType, update) => {
    try {
      await this.#moviesModel.updateMovie(updateType, update);
    } catch (err) {
      if (this.#isPopupOpen) {
        this.#popupPresenter.setPopupMovieUpdateAborting();
        return;
      }
      this.#setMovieCardUpdateAborting();
    }
  };

  #handlePopupOpenClick = () => {
    this.#hidePopup();

    this.#popupPresenter = new MoviePopupPresenter(
      this.#commentsModel,
      this.#filterModel,
      this.#hidePopup,
      this.#handleMovieUserDataUpdate
    );

    this.#commentsModel.init(this.#movie);
    this.#popupPresenter.init(this.#movie);

    this.#isPopupOpen = true;

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#handlePopupModelEvent);
    this.#commentsModel.addObserver(this.#handlePopupModelEvent);

    pageBody.classList.add(DOCUMENT_NO_SCROLL_CLASS);
  };

  #handlePopupModelEvent = (updateType, update) => {
    this.#uiBlocker.block();
    switch (updateType) {
      case UpdateType.PATCH:
        this.#popupPresenter.clearComments();
        this.#popupPresenter.updateComments(update);
        break;
      case UpdateType.MINOR:
        if (this.#movieCardPresenters.get(update.updatedMovie.id)) {
          this.#movieCardPresenters.get(update.updatedMovie.id).init(update.updatedMovie);
        }
        this.#updateMovieCardsBoard();
        this.#popupPresenter.init(update.updatedMovie);
        this.#popupPresenter.setPopupCommentsLoaded();
        break;
      case UpdateType.MAJOR:
        this.#updateMovieCardsBoard();
        this.#popupPresenter.init(update.updatedMovie);
        this.#popupPresenter.setPopupCommentsLoaded();
        break;
      case UpdateType.INIT:
        this.#popupPresenter.init(update);
        this.#popupPresenter.setPopupCommentsLoaded();
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleWatchlistClick = () => {
    const isInFilteredMovies = this.#filterModel.filter === FilterType.WATCHLIST
      ? UpdateType.MINOR
      : UpdateType.PATCH;

    this.#handleMovieUserDataUpdate(
      isInFilteredMovies,
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
    const isInFilteredMovies = this.#filterModel.filter === FilterType.HISTORY
      ? UpdateType.MINOR
      : UpdateType.PATCH;

    this.#handleMovieUserDataUpdate(
      isInFilteredMovies,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      });
  };

  #handleFavoriteClick = () => {
    const isInFilteredMovies = this.#filterModel.filter === FilterType.FAVORITES
      ? UpdateType.MINOR
      : UpdateType.PATCH;

    this.#handleMovieUserDataUpdate(
      isInFilteredMovies,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite}
      }
    );
  };

  #hidePopup = () => {
    this.hidePopup();
    this.#movieCardPresenters.forEach((presenter) => presenter.hidePopup());};
}
