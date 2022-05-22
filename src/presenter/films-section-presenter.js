import SortView from '../view/filters/sort-view.js';
import NavigationView from '../view/filters/navigation-view.js';
import ShowMoreButtonView from '../view/films/show-more-button-view.js';
import FilmsSectionView from '../view/films/films-section-view.js';
import FilmsListSectionView from '../view/films/films-list-section-view.js';
import FilmsListContainerView from '../view/films/films-list-container-view.js';
import FilmsListEmptyView from '../view/films/films-list-empty-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import { CARDS_PER_STEP, SortType } from '../const.js';
import { remove, render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';

export default class FilmsSectionPresenter {
  #pageMainSection = null;
  #filtersModel = null;
  #filmCardsModel = null;

  #currentSortType = SortType.DEFAULT;

  #renderedFilmIndex = 0;
  #sourcedFilms = [];
  #films = [];

  #filmCardPresenter = new Map();

  #sortComponent = new SortView();
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListSectionComponent = new FilmsListSectionView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsListEmpty = new FilmsListEmptyView();

  constructor(pageMainSection, filmCardsModel, filtersModel) {
    this.#pageMainSection = pageMainSection;
    this.#filmCardsModel = filmCardsModel;
    this.#filtersModel = filtersModel;
  }

  init = () => {
    this.#films = [...this.#filmCardsModel.films];
    this.#sourcedFilms = [...this.#filmCardsModel.films];
    this.#renderNavigation();
    this.#renderSort();
    this.#renderFilmCardsList();
  };


  #renderNavigation = () => {;
    render(navigationComponent, this.#pageMainSection);
  };

  #renderSort = () => render(this.#sortComponent, this.#pageMainSection);

  #renderCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent.element, this.#handleFilmChange, this.#onPopupOpen);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };

  #renderCards = () => {
    for (let i = 0; i < CARDS_PER_STEP && this.#renderedFilmIndex < this.#films.length; i++) {
      this.#renderCard(this.#films[this.#renderedFilmIndex]);
      this.#renderedFilmIndex++;
    }
  };

  #renderFilmCardsList = () => {
    this.#filmsListContainerComponent.element.innerHTML = '';

    render(this.#filmsSectionComponent, this.#pageMainSection);
    render(this.#filmsListSectionComponent, this.#filmsSectionComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListSectionComponent.element);

    this.#renderCards();

    if (this.#films.length > CARDS_PER_STEP) {
      this.#renderShowMoreButton();
    }

    if (!this.#films.length) {
      this.#renderFilmsListEmpty();
    }
  };

  #renderFilmsListEmpty = () => render(this.#filmsListEmpty, this.#filmsListContainerComponent.element);

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListSectionComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #handleShowMoreButtonClick = () => {
    if (this.#films.length - this.#renderedFilmIndex <= CARDS_PER_STEP) {
      remove(this.#showMoreButtonComponent);
    }
    this.#renderCards();
  };

  #handleFilmChange = (updateFilm) => {
    this.#films = updateItem(this.#films, updateFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updateFilm);
    this.#filmCardPresenter.get(updateFilm.id).init(updateFilm);
  };

  #onPopupOpen = () => this.#filmCardPresenter.forEach((presenter) => presenter.hidePopup());
}
