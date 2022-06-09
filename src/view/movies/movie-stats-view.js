
import AbstractView from '../../framework/view/abstract-view.js';

const createMovieStatsTemplate = (count) => count
  ? `<p>${count} movies inside</p>`
  : '';

export default class MovieStatsView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createMovieStatsTemplate(this.#count);
  }
}
