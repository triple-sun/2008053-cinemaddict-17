import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/films/show-more-button-view.js';
import FilmsSectionView from '../view/films/films-section-view.js';
import FilmsListSectionView from '../view/films/films-list-section-view.js';
import FilmsListContainerView from '../view/films/films-list-container-view.js';
import FilmsListEmptyView from '../view/films/films-list-empty-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import { CARDS_PER_STEP, FilterType, SortType, UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { sortFilmsByDateDown, sortFilmsByDefault, sortFilmsByRatingDown } from '../utils/film.js';

export default class FilmsSectionPresenter {
  #pageMainSection = null;
  #filterModel = null;
  #filmsModel = null;

  #filmsListEmptyComponent = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #renderedFilmCardCount = CARDS_PER_STEP;
  #filmCardPresenter = new Map();

  #filmsSectionComponent = new FilmsSectionView();
  #filmsListSectionComponent = new FilmsListSectionView();
  #filmsListContainerComponent = new FilmsListContainerView();

  constructor(pageMainSection, filmsModel, filterModel) {
    this.#pageMainSection = pageMainSection;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredFilms.sort(sortFilmsByDefault);
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDateDown);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRatingDown);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmCardsBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#pageMainSection, RenderPosition.AFTERBEGIN);
  };

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent.element, this.#handleFilmDataUpdate, this.#hidePopup, this.#filmsModel, this.#handleModelEvent);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };

  #renderFilmCards = (films) => films.forEach(this.#renderFilmCard);

  #renderFilmsListEmpty = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#filmsListEmptyComponent, this.#filmsListContainerComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.#filmsListSectionComponent.element);
  };

  #clearFilmCardsList = ({resetRenderedFilmCardCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    if (resetRenderedFilmCardCount) {
      this.#renderedFilmCardCount = CARDS_PER_STEP;
    } else {
      this.#renderedFilmCardCount = Math.min(filmsCount, this.#renderedFilmCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    remove(this.#showMoreButtonComponent);
  };

  #renderFilmCardsBoard = () => {
    const filmCardsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCardsCount, CARDS_PER_STEP));

    this.#filmsListContainerComponent.element.innerHTML = '';

    render(this.#filmsListContainerComponent, this.#filmsListSectionComponent.element);
    render(this.#filmsListSectionComponent, this.#filmsSectionComponent.element);
    render(this.#filmsSectionComponent, this.#pageMainSection);

    this.#renderSort();
    this.#renderFilmCards(films);

    if (filmCardsCount > CARDS_PER_STEP) {
      this.#renderShowMoreButton();
    }

    if (!filmCardsCount) {
      this.#renderFilmsListEmpty();
    }
  };


  #handleShowMoreButtonClick = () => {
    const filmCardsCount = this.films.length;
    const newRenderedFilmCardCount = Math.min(filmCardsCount, this.#renderedFilmCardCount + CARDS_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCardCount, newRenderedFilmCardCount);

    this.#renderFilmCards(films);

    this.#renderedFilmCardCount = newRenderedFilmCardCount;

    if (this.#renderedFilmCardCount >= filmCardsCount) {
      remove(this.#showMoreButtonComponent);
    }

  };

  #handleFilmDataUpdate = (updateType, update) => this.#filmsModel.updateFilm(updateType, update);

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmCardsList();
        this.#renderFilmCardsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmCardsList({resetRenderedFilmCardCount: true, resetSortType: true});
        this.#renderFilmCardsBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearFilmCardsList({resetRenderedTaskCount: true});
      this.#renderFilmCardsBoard();
    }
  };

  #hidePopup = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.hidePopup());
  };

}
