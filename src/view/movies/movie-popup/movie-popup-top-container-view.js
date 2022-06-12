import AbstractView from '../../../framework/view/abstract-stateful-view.js';

const createMoviePopupTopSectionTemplate = () => ('<div class="film-details__top-container"></div>');

export default class MoviePopupTopContainerView extends AbstractView {
  get template() {
    return createMoviePopupTopSectionTemplate();
  }
}
