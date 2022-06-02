import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const SORT_BUTTON_ACTIVE_CLASS = 'sort__button--active';

const createSortTemplate = (currentSortType) => (`
  <ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? SORT_BUTTON_ACTIVE_CLASS : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === (SortType.DATE || SortType.DATE) ? SORT_BUTTON_ACTIVE_CLASS : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === (SortType.RATING || SortType.RATING) ? SORT_BUTTON_ACTIVE_CLASS : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>
`);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A') {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  };
}
