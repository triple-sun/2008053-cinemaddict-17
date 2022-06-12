import AbstractView from '../../framework/view/abstract-view.js';

const createMoviesListLoadingFailTemplate = () => '<h2 class="films-list__title">Failed to load movies</h2>';

export default class MoviesListLoadingFailView extends AbstractView {
  get template() {
    return createMoviesListLoadingFailTemplate();
  }
}
