import AbstractView from '../../../framework/view/abstract-view.js';

const createMovieCardTemplate = () => ('<article class="film-card"></article>');

export default class MovieCardView extends AbstractView {
  get template() {
    return createMovieCardTemplate();
  }
}
