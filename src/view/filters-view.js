import AbstractView from '../framework/view/abstract-view.js';

const FILTER_ITEM_ACTIVE_CLASS = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${type.toLowerCase()}" class="main-navigation__item ${type === currentFilterType ? FILTER_ITEM_ACTIVE_CLASS : ''}" data-filter-type="${type}">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (`
    <nav class="main-navigation">
          ${filterItemsTemplate}
    </nav>
  `);
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };
}
