import AbstractView from '../../framework/view/abstract-view.js';

const createMoviesListLoadingTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

export default class MoviesListLoadingView extends AbstractView {
  get template() {
    return createMoviesListLoadingTemplate();
  }
}
