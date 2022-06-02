import FilmsSectionPresenter from './presenter/films-section-presenter.js';
import FilmsModel from './model/films-model.js';
import UserPresenter from './presenter/user-title-presenter.js';
import FilmsFiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';

const pageBody = document.body;
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const userPresenter = new UserPresenter(pageHeaderSection);
const navigationPresenter = new FilmsFiltersPresenter(pageMainSection, filmsModel, filterModel);
const filmsSectionPresenter = new FilmsSectionPresenter(pageMainSection, filmsModel, filterModel);

userPresenter.init();
navigationPresenter.init();
filmsSectionPresenter.init();
