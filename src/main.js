import FilmsSectionPresenter from './presenter/films-section-presenter.js';
import UserTitleView from './view/user-title-view.js';
import NavigationView from './view/navigation-view.js';
import FiltersView from './view/filters-view.js';
import FilmPopupView from './view/film-popup-view.js';
import { render } from './render.js';

const pageBody = document.querySelector('body');
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const filmsSectionPresenter = new FilmsSectionPresenter();

render(new UserTitleView(), pageHeaderSection);
render(new NavigationView(), pageMainSection);
render(new FiltersView(), pageMainSection);
render(new FilmPopupView, pageBody);

filmsSectionPresenter.init(pageMainSection);
