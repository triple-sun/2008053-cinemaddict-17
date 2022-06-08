import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/movies/show-more-button-view.js';
import MoviesSectionView from '../view/movies/movies-section-view.js';
import MoviesListSectionView from '../view/movies/movies-list-section-view.js';
import MoviesListContainerView from '../view/movies/movies-list-container-view.js';
import MoviesListEmptyView from '../view/movies/movies-list-empty-view.js';
import MovieCardPresenter from './movie-card-presenter.js';
import MoviesListLoadingView from '../view/movies/movies-list-loading-view.js';
import { CARDS_PER_STEP, FilterType, SortType, UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { sortFilmsByDateDown, sortFilmsByDefault, sortFilmsByRatingDown } from '../utils/movie.js';

export default class MoviesSectionPresenter {
  #pageMainSection = null;
  #filterModel = null;
  #moviesModel = null;
  #commentsModel = null;

  #sortComponent = null;
  #moviesListEmptyComponent = null;
  #showMoreButtonComponent = null;

  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #isLoading = true;

  #renderedMovieCardCount = CARDS_PER_STEP;
  #movieCardPresenter = new Map();

  #loadingComponent = new MoviesListLoadingView();
  #moviesSectionComponent = new MoviesSectionView();
  #moviesListSectionComponent = new MoviesListSectionView();
  #moviesListContainerComponent = new MoviesListContainerView();

  constructor(pageMainSection, moviesModel, filterModel, commentsModel) {
    this.#pageMainSection = pageMainSection;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[filterType](movies);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredMovies.sort(sortFilmsByDefault);
      case SortType.DATE:
        return filteredMovies.sort(sortFilmsByDateDown);
      case SortType.RATING:
        return filteredMovies.sort(sortFilmsByRatingDown);
    }

    return filteredMovies;
  }

  init = () => {
    this.#renderMovieCardsBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#pageMainSection, RenderPosition.AFTERBEGIN);
  };

  #renderMovieCard = (movie) => {
    const movieCardPresenter = new MovieCardPresenter(
      this.#moviesListContainerComponent.element,
      this.#handleMovieDataUpdate,
      this.#hidePopup,
      this.#moviesModel,
      this.#commentsModel,
      this.#handleModelEvent
    );

    movieCardPresenter.init(movie);
    this.#movieCardPresenter.set(movie.id, movieCardPresenter);
  };

  #renderMovieCards = (movies) => movies.forEach(this.#renderMovieCard);

  #renderLoading = () => {
    render(this.#loadingComponent, this.#moviesListSectionComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderMoviesListEmpty = () => {
    this.#moviesListEmptyComponent = new MoviesListEmptyView(this.#currentFilterType);
    render(this.#moviesListEmptyComponent, this.#moviesListContainerComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.#moviesListSectionComponent.element);
  };

  #clearMovieCardsList = ({resetRenderedMovieCardCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#movieCardPresenter.forEach((presenter) => presenter.destroy());
    this.#movieCardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#moviesListEmptyComponent) {
      remove(this.#moviesListEmptyComponent);
    }

    if (resetRenderedMovieCardCount) {
      this.#renderedMovieCardCount = CARDS_PER_STEP;
    } else {
      this.#renderedMovieCardCount = Math.min(moviesCount, this.#renderedMovieCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    remove(this.#showMoreButtonComponent);
  };

  #renderMovieCardsBoard = () => {
    render(this.#moviesSectionComponent, this.#pageMainSection);
    render(this.#moviesListSectionComponent, this.#moviesSectionComponent.element);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const movieCardsCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(movieCardsCount, CARDS_PER_STEP));

    this.#moviesListContainerComponent.element.innerHTML = '';

    render(this.#moviesListContainerComponent, this.#moviesListSectionComponent.element);


    this.#renderSort();
    this.#renderMovieCards(movies);

    if (movieCardsCount > CARDS_PER_STEP) {
      this.#renderShowMoreButton();
    }

    if (!movieCardsCount) {
      this.#renderMoviesListEmpty();
    }
  };


  #handleShowMoreButtonClick = () => {
    const movieCardsCount = this.movies.length;
    const newRenderedMovieCardCount = Math.min(movieCardsCount, this.#renderedMovieCardCount + CARDS_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCardCount, newRenderedMovieCardCount);

    this.#renderMovieCards(movies);

    this.#renderedMovieCardCount = newRenderedMovieCardCount;

    if (this.#renderedMovieCardCount >= movieCardsCount) {
      remove(this.#showMoreButtonComponent);
    }

  };

  #handleMovieDataUpdate = (updateType, update) => this.#moviesModel.updateMovie(updateType, update);

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#movieCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMovieCardsList();
        this.#renderMovieCardsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearMovieCardsList({resetRenderedMovieCardCount: true, resetSortType: true});
        this.#renderMovieCardsBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderMovieCardsBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearMovieCardsList({resetRenderedTaskCount: true});
      this.#renderMovieCardsBoard();
    }
  };

  #hidePopup = () => {
    this.#movieCardPresenter.forEach((presenter) => presenter.hidePopup());
  };

}
