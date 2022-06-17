import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/movies/show-more-button-view.js';
import MoviesSectionView from '../view/movies/movies-section-view.js';
import MoviesListSectionView from '../view/movies/movies-list-section-view.js';
import MoviesListContainerView from '../view/movies/movies-list-container-view.js';
import MoviesListEmptyView from '../view/movies/movies-list-empty-view.js';
import MovieCardPresenter from './movie-card-presenter.js';
import MoviesListLoadingView from '../view/movies/movies-list-loading-view.js';
import { CARDS_PER_STEP, ExtraCategory, FilterType, pageFooterSection, pageHeaderSection, pageMainSection, SortType, TimeLimit, UpdateType } from '../const.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { sortFilmsByDateDown, sortFilmsByDefault, sortFilmsByRatingDown, sortMoviesByCommentsCount } from '../utils/movie.js';
import MovieStatsView from '../view/movies/movie-stats-view.js';
import UserTitleView from '../view/user-title-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import MoviesListLoadingFailView from '../view/movies/movies-list-fail-view.js';
import MoviesListExtraView from '../view/movies/movies-list-extra-view.js';

const movieStatisticsSection = pageFooterSection.querySelector('.footer__statistics');

export default class MoviesSectionPresenter {
  #filterModel = null;
  #moviesModel = null;
  #commentsModel = null;

  #sortComponent = null;
  #moviesListEmptyComponent = null;
  #showMoreButtonComponent = null;
  #movieStatsComponent = null;
  #userTitleComponent = null;

  #topRatedMovies = null;
  #mostCommentedMovies = null;

  #isLoading = true;
  #currentSortType = SortType.DEFAULT;

  #pageMainSection = pageMainSection;
  #renderedMovieCardCount = CARDS_PER_STEP;
  #movieCardPresenters = new Map();
  #movieCardTopRatedPresenters = new Map();
  #movieCardMostCommentedPresenters = new Map();

  #moviesSectionComponent = new MoviesSectionView();
  #moviesListSectionComponent = new MoviesListSectionView();
  #moviesListContainerComponent = new MoviesListContainerView();
  #moviesListLoadingComponent = new MoviesListLoadingView();
  #moviesListLoadingFailComponent = new MoviesListLoadingFailView();

  #moviesListExtraTopRatedContainerComponent = new MoviesListContainerView();
  #moviesListExtraMostCommentedContainerComoponent = new MoviesListContainerView();

  #moviesListExtraTopRatedComponent = new MoviesListExtraView(ExtraCategory.TOP_RATED);
  #moviesListExtraMostCommentedComponent = new MoviesListExtraView(ExtraCategory.MOST_COMMENTED);

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(moviesModel, filterModel, commentsModel) {
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

  init = () => this.#renderMovieCardsBoard();

  #renderUserTitle = () => {
    const movies = this.#moviesModel.movies;
    const watchedMoviesCount = filter[FilterType.HISTORY](movies).length;

    this.#userTitleComponent = new UserTitleView(watchedMoviesCount);

    if (this.#userTitleComponent) {
      remove(this.#userTitleComponent);
    }

    render(this.#userTitleComponent, pageHeaderSection);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pageMainSection, RenderPosition.AFTERBEGIN);
  };

  #renderMovieCard = (movie) => {
    const movieCardPresenter = new MovieCardPresenter(
      this.#moviesListContainerComponent.element,
      this.#handleModelEvent,
      this.#moviesModel,
      this.#commentsModel,
      this.#filterModel,
      this.#movieCardPresenters,
      this.#uiBlocker,
      this.#updateMostCommentedMoviesList
    );

    movieCardPresenter.init(movie);
    this.#movieCardPresenters.set(movie.id, movieCardPresenter);
  };

  #renderMovieCards = (movies) => movies.forEach(this.#renderMovieCard);

  #renderLoading = () => render(this.#moviesListLoadingComponent, this.#moviesListSectionComponent.element, RenderPosition.AFTERBEGIN);

  #renderMoviesListEmpty = () => {
    this.#moviesListEmptyComponent = new MoviesListEmptyView(this.#filterModel.filter);
    render(this.#moviesListEmptyComponent, this.#moviesListContainerComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.#moviesListSectionComponent.element);
  };

  #clearMovieCardsList = ({resetRenderedMovieCardCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#movieCardPresenters.forEach((presenter) => presenter.destroy());
    this.#movieCardTopRatedPresenters.forEach((presenter) => presenter.destroy());
    this.#movieCardMostCommentedPresenters.forEach((presenter) => presenter.destroy());

    this.#movieCardPresenters.clear();
    this.#movieCardTopRatedPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#userTitleComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#movieStatsComponent);

    if (this.#moviesListEmptyComponent) {
      remove(this.#moviesListEmptyComponent);
    }

    if (this.#moviesListExtraTopRatedComponent) {
      remove(this.#moviesListExtraTopRatedComponent);
    }

    if (this.#moviesListExtraMostCommentedComponent) {
      remove(this.#moviesListExtraMostCommentedComponent);
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
    const totalMovieCount = this.#moviesModel.movies.length;
    const movieCardsCount = this.movies.length;
    const movies = this.#renderedMovieCardCount
      ? this.movies.slice(0, Math.min(movieCardsCount, this.#renderedMovieCardCount))
      : this.movies.slice(0, Math.min(movieCardsCount, CARDS_PER_STEP));

    this.#topRatedMovies = this.#moviesModel.movies.sort(sortFilmsByRatingDown).slice(0, 2);
    this.#mostCommentedMovies = this.#moviesModel.movies.sort(sortMoviesByCommentsCount).slice(0, 2);

    render(this.#moviesSectionComponent, this.#pageMainSection);
    render(this.#moviesListSectionComponent, this.#moviesSectionComponent.element);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    render(this.#moviesListContainerComponent, this.#moviesListSectionComponent.element);

    this.#renderUserTitle();

    if (movieCardsCount) {
      this.#renderSort();
      this.#renderMovieCards(movies);
    }

    if (movieCardsCount > this.#renderedMovieCardCount) {
      this.#renderShowMoreButton();
    }

    if (!movieCardsCount) {
      this.#renderMoviesListEmpty();
    }

    if (this.#topRatedMovies.length) {
      this.#renderMoviesListExtraTopRated();
    }

    if (this.#mostCommentedMovies.length) {
      this.#renderMoviesListExtraMostCommented();
    }

    this.#renderMovieStats(totalMovieCount);
  };

  #renderMoviesListExtraTopRated = () => {
    render(this.#moviesListExtraTopRatedComponent, this.#moviesSectionComponent.element);
    render(this.#moviesListExtraTopRatedContainerComponent, this.#moviesListExtraTopRatedComponent.element);
    this.#renderMoviesListExtras(this.#topRatedMovies, this.#moviesListExtraTopRatedContainerComponent, this.#movieCardTopRatedPresenters);
  };

  #renderMoviesListExtraMostCommented = () => {
    render(this.#moviesListExtraMostCommentedComponent, this.#moviesSectionComponent.element);
    render(this.#moviesListExtraMostCommentedContainerComoponent, this.#moviesListExtraMostCommentedComponent.element);

    this.#renderMoviesListExtras(this.#mostCommentedMovies, this.#moviesListExtraMostCommentedContainerComoponent, this.#movieCardMostCommentedPresenters);
  };

  #updateMostCommentedMoviesList = (movies) => {
    this.#mostCommentedMovies = movies.sort(sortMoviesByCommentsCount).slice(0, 2);
    this.#movieCardMostCommentedPresenters.forEach((presenter) => presenter.destroy());
    this.#movieCardMostCommentedPresenters.clear();
    this.#renderMoviesListExtras(this.#mostCommentedMovies, this.#moviesListExtraMostCommentedContainerComoponent, this.#movieCardMostCommentedPresenters);
  };

  #renderMoviesListExtraCard = (movie, extraContainerComponent, extraPresenters) => {
    const movieCardPresenter = new MovieCardPresenter(
      extraContainerComponent.element,
      this.#handleModelEvent,
      this.#moviesModel,
      this.#commentsModel,
      this.#filterModel,
      extraPresenters,
      this.#uiBlocker,
      this.#updateMostCommentedMoviesList
    );

    extraPresenters.set(movie.id, movieCardPresenter);
    movieCardPresenter.init(movie);
  };

  #renderMoviesListExtras = (extras, container, extraPresenters) => extras.forEach((movie) => this.#renderMoviesListExtraCard(movie, container, extraPresenters));

  #renderMovieStats = (count) => {
    this.#movieStatsComponent = new MovieStatsView(count);
    render(this.#movieStatsComponent, movieStatisticsSection);
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

  #handleModelEvent = (updateType, data) => {
    this.#uiBlocker.block();
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#movieCardTopRatedPresenters.get(data.id)) {
          this.#movieCardTopRatedPresenters.get(data.id).init(data);
        }
        if (this.#movieCardMostCommentedPresenters.get(data.id)) {
          this.#movieCardMostCommentedPresenters.get(data.id).init(data);
        }
        this.#movieCardPresenters.get(data.id).init(data);
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
        remove(this.#moviesListLoadingComponent);
        this.#renderMovieCardsBoard();
        break;
      case UpdateType.FAIL:
        replace(this.#moviesListLoadingFailComponent, this.#moviesListLoadingComponent);
    }
    this.#uiBlocker.unblock();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearMovieCardsList({resetRenderedMovieCardCount: true});
      this.#renderMovieCardsBoard();
    }
  };
}
