import AbstractView from '../../framework/view/abstract-view.js';

const createMoviesListExtraTemplate = (extraCategory) => `<section class="films-list films-list--extra"><h2 class="films-list__title">${extraCategory}</h2></section>`;

export default class MoviesListExtraView extends AbstractView {
  #extraCategory = null;

  constructor(extraCategory) {
    super();
    this.#extraCategory = extraCategory;
  }

  get template() {
    return createMoviesListExtraTemplate(this.#extraCategory);
  }
}
