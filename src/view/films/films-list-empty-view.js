import { FilterType } from '../../const.js';
import AbstractView from '../../framework/view/abstract-view.js';

const FilmsListEmptyType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmsListEmptyTemplate = (filterType) => {
  const filmsListEmptyTextValue = FilmsListEmptyType[filterType];

  return (`<h2 class="films-list__title">${filmsListEmptyTextValue}</h2>`);
};

export default class FilmsListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createFilmsListEmptyTemplate(this.#filterType);
  }
}
