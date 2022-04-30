import FilmsSectionPresenter from './presenter/films-section-presenter.js';
import FilmPopupPresenter from './presenter/film-popup-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import UserTitleView from './view/user-title-view.js';
import NavigationView from './view/navigation-view.js';
import FiltersView from './view/filters-view.js';
import Comments from './model/comments-model.js';
import { render } from './render.js';
import { generateFilm } from './mock/film.js';

const pageBody = document.querySelector('body');
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const filmsSectionPresenter = new FilmsSectionPresenter();
const filmCardsModel = new FilmCardsModel();

const popupFilm = generateFilm();
const filmPopupPresenter = new FilmPopupPresenter();
const commentsModel = new Comments(popupFilm);

render(new UserTitleView(), pageHeaderSection);
render(new NavigationView(), pageMainSection);
render(new FiltersView(), pageMainSection);

filmsSectionPresenter.init(pageMainSection, filmCardsModel);
filmPopupPresenter.init(pageBody, popupFilm, commentsModel);

