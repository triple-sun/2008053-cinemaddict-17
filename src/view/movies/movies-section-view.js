import AbstractView from '../../framework/view/abstract-view.js';

const createMoviesSectionTemplate = () => '<section class="films"></section>';

export default class MoviesSectionView extends AbstractView {
  get template() {
    return createMoviesSectionTemplate();
  }
}
