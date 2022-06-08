import { render, remove, replace } from '../framework/render.js';
import MovieCardView from '../view/movies/movie-card-view.js';
import MoviePopupPresenter from './movie-popup-presenter.js';
import { DOCUMENT_NO_SCROLL_CLASS, UpdateType } from '../const.js';

export default class MovieCardPresenter {
  #movieCardComponent = null;
  #moviesListContainerComponent = null;
  #handleMovieUserDataUpdate = null;
  #moviesModel = null;
  #handleModelEvent = null;
  #commentsModel = null;

  #movie = null;
  #popupPresenter = null;
  #hidePopup = null;

  #isPopupOpen = false;

  constructor(moviesListContainerComponent, handleMovieUserDataUpdate, hidePopup, moviesModel, commentsModel, handleModelEvent) {
    this.#moviesListContainerComponent = moviesListContainerComponent;
    this.#handleMovieUserDataUpdate = handleMovieUserDataUpdate;
    this.#hidePopup = hidePopup;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#handleModelEvent = handleModelEvent;
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
      this.#isPopupOpen = false;
    }
  };

  #handlePopupOpenClick = () => {
    this.#commentsModel.init(this.#movie);
    this.#hidePopup();
    this.#popupPresenter = new MoviePopupPresenter(
      this.#commentsModel,
      this.hidePopup,
      this.#handleWatchlistClick,
      this.#handleAlreadyWatchedClick,
      this.#handleFavoriteClick,
    );
    this.#popupPresenter.init(this.#movie);
    this.#isPopupOpen = true;
  };

  #handleFavoriteClick = () => {
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

  #handleWatchlistClick = () => {
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

  #handleAlreadyWatchedClick = () => {
    this.#handleMovieUserDataUpdate(
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      });
  };
}
