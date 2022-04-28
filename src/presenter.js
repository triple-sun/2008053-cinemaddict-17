import UserTitleView from './view/user-title.js';
import Navigation from './view/navigation.js';
import Filters from './view/filters.js';
import FilmCard from './view/card.js';
import MoviePopup from './view/popup.js';
import ShowMoreButtonView from './view/show-more-button.js';
import { render } from './render.js';
import { MAX_CARDS, FILMS_LIST_TITLE } from './constants.js';

const pageBody = document.querySelector('body');
const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const navigationElement = document.createElement('nav');
const filtersElement = document.createElement('ul');
const filmsElement = document.createElement('section');
const filmsListElement = document.createElement('section');
const filmsListContainer = document.createElement('div');

navigationElement.classList.add('main-navigation');
filtersElement.classList.add('sort');
filmsElement.classList.add('films');
filmsListElement.classList.add('films-list');
filmsListContainer.classList.add('films-list__container');
filmsListElement.innerHTML = FILMS_LIST_TITLE;

filmsListElement.append(filmsListContainer);
filmsElement.append(filmsListElement);
pageMainSection.append(navigationElement);
pageMainSection.append(filtersElement);
pageMainSection.append(filmsElement);

for (let i = 0; i < MAX_CARDS; i++) {
  render(new FilmCard(), filmsListContainer);
}

render(new UserTitleView(), pageHeaderSection);
render(new Navigation(), navigationElement);
render(new Filters(), filtersElement);
render(new ShowMoreButtonView(), filmsListElement);
render(new MoviePopup, pageBody);
