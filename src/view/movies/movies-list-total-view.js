
import AbstractView from '../../framework/view/abstract-view.js';

const createMoviesListSectionTemplate = (count) => count
  ? `<p>${count} movies inside</p>`
  : '';

export default class MoviesListTotalView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createMoviesListSectionTemplate(this.#count);
  }
}
