import FilmsSectionPresenter from './presenter/films-section-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import { generateFilter } from './mock/filter.js';
import UserPresenter from './presenter/user-title-presenter.js';

const pageBody = document.body;
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const filmCardsModel = new FilmCardsModel();
const filtersModel = generateFilter(filmCardsModel.films);

const userPresenter = new UserPresenter(pageHeaderSection);
const filmsSectionPresenter = new FilmsSectionPresenter(pageMainSection, filmCardsModel, filtersModel);

userPresenter.init();
filmsSectionPresenter.init();
