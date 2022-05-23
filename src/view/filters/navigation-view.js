import AbstractView from '../../framework/view/abstract-view.js';
import { createTemplatesFromArray } from '../../utils/film.js';

const createNavigationItemTemplate = (filter) => {
  const {name, target, count} = filter;
  return `<a href="${target}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createNavigationTemplate = (filters) => {
  const filterItemsTemplate = createTemplatesFromArray([...filters], createNavigationItemTemplate);
  return (`
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
          ${filterItemsTemplate}
    </nav>
  `);
};

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
