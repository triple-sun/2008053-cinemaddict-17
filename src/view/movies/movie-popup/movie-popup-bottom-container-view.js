import AbstractView from '../../../framework/view/abstract-view.js';

const createMoviePopupBottomContainerTemplate = () => ('<div class="film-details__bottom-container"></div>');

export default class MoviePopupBottomContainerView extends AbstractView {
  get template() {
    return createMoviePopupBottomContainerTemplate();
  }
}
