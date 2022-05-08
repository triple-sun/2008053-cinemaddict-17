import FilmsSectionPresenter from './presenter/films-section-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import UserTitleView from './view/user-title-view.js';
import NavigationView from './view/filters/navigation-view.js';
import SortView from './view/filters/sort-view.js';
import { render } from './render.js';
import { generateFilter } from './mock/filter.js';

const pageBody = document.querySelector('body');
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const filmCardsModel = new FilmCardsModel();
const filters = generateFilter(filmCardsModel.cards);
const filmsSectionPresenter = new FilmsSectionPresenter(pageMainSection, pageBody, filmCardsModel);

render(new UserTitleView(), pageHeaderSection);
render(new NavigationView(filters), pageMainSection);
render(new SortView(), pageMainSection);

filmsSectionPresenter.init();
