import AbstractView from '../../framework/view/abstract-view.js';

const createMoviesListContainerTemplate = () => '<div class="films-list__container"></div>';

export default class MoviesListContainerView extends AbstractView {
  get template() {
    return createMoviesListContainerTemplate();
  }
}
